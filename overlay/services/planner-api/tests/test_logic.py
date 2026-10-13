import datetime as dt

import pytest

from app import logic


def test_kpi_status_bands():
    assert logic.kpi_status(0, 80, 100) == "on-track"
    assert logic.kpi_status(0, 79, 100) == "at-risk"
    assert logic.kpi_status(0, 40, 100) == "at-risk"
    assert logic.kpi_status(0, 39, 100) == "off-track"
    assert logic.kpi_status(0, 0, 0) == "on-track"          # nothing to reach, nothing missing
    assert logic.kpi_status(10, 9, 10) == "off-track"
    assert logic.kpi_status(100, 20, 0) == "on-track"        # a target below the baseline counts the same way
    assert logic.kpi_status(100, 90, 0) == "off-track"


def test_kpi_trend():
    assert (logic.kpi_trend(1, 2), logic.kpi_trend(2, 1), logic.kpi_trend(2, 2)) == ("up", "down", "flat")


def test_key_result_progress():
    assert logic.kr_progress(0, 0, 10) == (0.0, "behind")
    assert logic.kr_progress(0, 4, 10) == (40.0, "at-risk")
    assert logic.kr_progress(0, 7, 10) == (70.0, "on-track")
    assert logic.kr_progress(0, 10, 10) == (100.0, "achieved")
    assert logic.kr_progress(0, 25, 10) == (100.0, "achieved")   # capped
    assert logic.kr_progress(0, -5, 10) == (0.0, "behind")       # floored
    assert logic.kr_progress(100, 60, 0) == (40.0, "at-risk")    # falling towards a lower target
    assert logic.kr_progress(5, 5, 5) == (100.0, "achieved")
    assert logic.kr_progress(5, 4, 5) == (0.0, "behind")


def test_quarters():
    assert logic.quarter_label(4) == "Q4"
    assert logic.quarter_number("Q2") == 2
    assert logic.quarter_number(None) is None and logic.quarter_number("x") is None


def test_pdca_phases():
    assert logic.normalise_phase({"notes": "n"}) == {"notes": "n", "completed": False, "completed_at": None}
    assert logic.normalise_phase(None) == logic.empty_phase()
    assert logic.normalise_phase({"findings": "old shape"})["notes"] == ""
    assert logic.advance("plan", "plan", True) == ("do", "in-progress")
    assert logic.advance("plan", "plan", False) == ("plan", "in-progress")
    assert logic.advance("do", "plan", True) == ("do", "in-progress")      # editing an earlier phase does not move on
    assert logic.advance("act", "act", True) == ("act", "completed")


def test_week_start_is_monday():
    assert logic.week_start(dt.date(2026, 10, 12)) == dt.date(2026, 10, 12)   # a Monday
    assert logic.week_start(dt.date(2026, 10, 18)) == dt.date(2026, 10, 12)   # the Sunday after
    assert logic.week_start(dt.date(2026, 10, 14)).weekday() == 0


def test_equity_split_sums_to_100_and_follows_contribution():
    r = logic.equity_split([
        {"name": "A", "role": "ceo", "timeCommitmentMonths": 24, "capitalContribution": 20000, "ideaOriginator": True, "priorExperience": "high"},
        {"name": "B", "role": "cto", "timeCommitmentMonths": 12, "capitalContribution": 0, "ideaOriginator": False, "priorExperience": "medium"},
        {"name": "C", "role": "other", "timeCommitmentMonths": 3, "capitalContribution": 0, "ideaOriginator": False, "priorExperience": "low"},
    ])
    pcts = [s["equityPct"] for s in r["splits"]]
    assert round(sum(pcts), 1) == 100.0
    assert pcts[0] > pcts[1] > pcts[2]
    assert r["totalScore"] == sum(s["score"] for s in r["splits"])


def test_equity_single_founder_gets_everything():
    assert logic.equity_split([{"name": "Me", "role": "ceo"}])["splits"][0]["equityPct"] == 100.0


def test_equity_caps_time_and_capital():
    capped = logic.founder_score({"role": "other", "timeCommitmentMonths": 1000, "capitalContribution": 10_000_000, "priorExperience": "low"})
    assert capped == 20 + 5 + 50 + 20
    assert logic.founder_score({"role": "nonsense", "priorExperience": "nonsense"}) == 25    # unknown values fall back to the lowest weights


def test_vesting_schedule():
    r = logic.vesting(1000, 12, 48, False)
    assert r["cliffShares"] == 250 and r["monthlyVest"] == 21
    assert r["schedule"][0] == {"month": 0, "cumulativeVested": 0}
    assert r["schedule"][1] == {"month": 12, "cumulativeVested": 250}
    assert r["schedule"][-1] == {"month": 48, "cumulativeVested": 1000}
    months = [e["month"] for e in r["schedule"]]
    assert months == sorted(months) and months[2] == 15
    vested = [e["cumulativeVested"] for e in r["schedule"]]
    assert vested == sorted(vested)
    assert "accelerationNote" not in r
    assert "accelerationNote" in logic.vesting(1000, 0, 12, True)


@pytest.mark.parametrize("args", [(0, 12, 48), (1000, 12, 0), (1000, -1, 48), (1000, 49, 48)])
def test_vesting_rejects_nonsense(args):
    with pytest.raises(ValueError):
        logic.vesting(*args, False)


def test_equity_rejects_zero_total():
    # no founders at all can never reach here (the route refuses an empty list), but a zero total must still be refused
    with pytest.raises(ValueError):
        logic.equity_split([])
