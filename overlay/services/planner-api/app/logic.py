"""The planner's calculations, kept free of I/O so they can be tested on their own."""
import datetime as dt
import math

from .core import clamp


# ---- KPIs ----
def kpi_status(baseline: float, current: float, target: float) -> str:
    """How far from the baseline towards the target: >= 80% on-track, >= 40% at-risk, else off-track."""
    if target == baseline:
        return "on-track" if current == target else "off-track"
    progress = (current - baseline) / (target - baseline)
    return "on-track" if progress >= 0.8 else "at-risk" if progress >= 0.4 else "off-track"


def kpi_trend(old: float, new: float) -> str:
    return "up" if new > old else "down" if new < old else "flat"


# ---- OKR key results ----
def kr_progress(start: float, current: float, target: float) -> tuple[float, str]:
    """(progress 0..100, status): >= 100 achieved, >= 70 on-track, >= 40 at-risk, else behind."""
    if target == start:
        progress = 100.0 if current == target else 0.0
    else:
        progress = clamp((current - start) * 100.0 / (target - start), 0.0, 100.0)
    progress = round(progress, 2)
    status = "achieved" if progress >= 100 else "on-track" if progress >= 70 else "at-risk" if progress >= 40 else "behind"
    return progress, status


def quarter_label(n: int) -> str:
    return f"Q{n}"


def quarter_number(label):
    return int(label[1:]) if isinstance(label, str) and label[:1] == "Q" and label[1:].isdigit() else None


# ---- PDCA ----
PHASES = ["plan", "do", "check", "act"]


def empty_phase() -> dict:
    return {"notes": "", "completed": False, "completed_at": None}


def normalise_phase(raw) -> dict:
    """Stored phases may predate the frontend's shape (notes / completed / completed_at)."""
    p = empty_phase()
    if isinstance(raw, dict):
        p["notes"] = str(raw.get("notes") or "")
        p["completed"] = bool(raw.get("completed", False))
        p["completed_at"] = raw.get("completed_at")
    return p


def advance(current: str, phase: str, completed: bool) -> tuple[str, str]:
    """(current_phase, status) after saving `phase`. Finishing the phase you are on moves to the next one;
    finishing the last one completes the cycle."""
    status = "in-progress"
    if completed and phase == current:
        i = PHASES.index(phase)
        if i == len(PHASES) - 1:
            return phase, "completed"
        return PHASES[i + 1], status
    return current, status


# ---- weeks ----
def week_start(day: dt.date) -> dt.date:
    return day - dt.timedelta(days=day.weekday())


# ---- legal calculators (weights as in the original legal-team service) ----
ROLE = {"ceo": 40, "cto": 35, "cmo": 25, "coo": 25, "other": 20}
EXPERIENCE = {"high": 15, "medium": 10, "low": 5}
MAX_TIME, TIME_PER_MONTH, MAX_CAPITAL, CAPITAL_PER_1000, IDEA = 50.0, 1.5, 20.0, 1.0, 10.0


def founder_score(f: dict) -> float:
    months = float(f.get("timeCommitmentMonths") or 0)
    capital = float(f.get("capitalContribution") or 0)
    return (ROLE.get(f.get("role"), ROLE["other"]) + EXPERIENCE.get(f.get("priorExperience"), EXPERIENCE["low"])
            + min(months * TIME_PER_MONTH, MAX_TIME) + min(capital / 1000.0 * CAPITAL_PER_1000, MAX_CAPITAL)
            + (IDEA if f.get("ideaOriginator") else 0.0))


def _round1(x: float) -> float:
    return math.floor(x * 10 + 0.5) / 10


def equity_split(founders) -> dict:
    scores = [founder_score(f) for f in founders]
    total = sum(scores)
    if total <= 0:
        raise ValueError("total score is zero")
    pcts = [_round1(s / total * 100.0) for s in scores]
    diff = _round1(100.0 - sum(pcts))
    if diff:  # rounding drift goes to the biggest share, so the shares always add up to 100
        i = max(range(len(scores)), key=lambda k: scores[k])
        pcts[i] = _round1(pcts[i] + diff)
    return {"splits": [{"name": f.get("name", ""), "score": s, "equityPct": p} for f, s, p in zip(founders, scores, pcts)],
            "totalScore": total}


def _round_half_up(x: float) -> int:
    return int(math.floor(x + 0.5))


def vesting(total: int, cliff: int, months: int, acceleration: bool) -> dict:
    if total <= 0 or months <= 0 or cliff < 0 or cliff > months:
        raise ValueError("invalid vesting parameters")
    cliff_shares = _round_half_up(cliff / months * total)
    post = months - cliff
    monthly = (total - cliff_shares) / post if post > 0 else 0.0
    schedule = [{"month": 0, "cumulativeVested": 0}]
    if cliff > 0:
        schedule.append({"month": cliff, "cumulativeVested": cliff_shares})
    m = cliff + 3
    while m < months:
        schedule.append({"month": m, "cumulativeVested": cliff_shares + _round_half_up((m - cliff) * monthly)})
        m += 3
    schedule.append({"month": months, "cumulativeVested": total})
    out = {"cliffShares": cliff_shares, "monthlyVest": _round_half_up(monthly), "schedule": schedule}
    if acceleration:
        out["accelerationNote"] = "Double-trigger acceleration applies on change of control"
    return out
