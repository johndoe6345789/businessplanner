"""Sample business data for the stand-in services. Deterministic (the same on every call) and anchored to
today's date, so the accounting pages always show recent, plausible figures."""
import datetime as dt
from decimal import Decimal

CUSTOMERS = ["Hungarton Village Hall", "Leicester Bakehouse", "Quorn Physio Clinic", "Oakham Garden Centre", "Syston Plumbing Supplies",
             "Melton Dental Care", "Loughborough Cycles", "Market Harborough Florist"]


def month_start(today: dt.date, back: int) -> dt.date:
    y, m = today.year, today.month - back
    while m <= 0:
        y, m = y - 1, m + 12
    return dt.date(y, m, 1)


def money(x) -> str:
    return f"{Decimal(x):.2f}"


def invoices(today: dt.date | None = None) -> list[dict]:
    today = today or dt.date.today()
    out = []
    for i in range(14):
        issued = month_start(today, i // 2) + dt.timedelta(days=4 + (i % 2) * 13)
        total = [450, 30, 520, 30, 600, 30, 400, 30, 550, 30, 480, 30, 250, 30][i]
        due = issued + dt.timedelta(days=14)
        if issued > today:
            status, paid = "DRAFT", 0
        elif i < 3:
            status, paid = "AUTHORISED", 0                 # recent: still waiting to be paid
        elif i == 5:
            status, paid = "AUTHORISED", 0                 # one overdue
        else:
            status, paid = "PAID", total
        out.append({"InvoiceID": f"00000000-0000-4000-8000-{i:012d}", "InvoiceNumber": f"INV-{1001 + i}", "Contact": {"Name": CUSTOMERS[i % len(CUSTOMERS)]},
                    "DateString": issued.isoformat() + "T00:00:00", "DueDateString": due.isoformat() + "T00:00:00",
                    "AmountDue": total - paid, "AmountPaid": paid, "Total": total, "Status": status, "CurrencyCode": "GBP"})
    return out


def bank_transactions(today: dt.date | None = None) -> list[dict]:
    today = today or dt.date.today()
    rows = []
    for inv in invoices(today):
        if inv["Status"] == "PAID":
            paid_on = dt.date.fromisoformat(inv["DateString"][:10]) + dt.timedelta(days=10)
            rows.append(("RECEIVE", paid_on, inv["Total"], inv["InvoiceNumber"], True))
    for back in range(6):
        for day, amount, ref in ((2, 5, "Backup storage"), (3, 12, "Domain renewals"), (9, 35, "Business insurance")):
            rows.append(("SPEND", month_start(today, back) + dt.timedelta(days=day), amount, ref, back > 0))
    rows = [r for r in rows if r[1] <= today]
    rows.sort(key=lambda r: r[1], reverse=True)
    return [{"BankTransactionID": f"10000000-0000-4000-8000-{i:012d}", "DateString": d.isoformat() + "T00:00:00", "BankAccount": {"Name": "Business Current Account"},
             "Type": t, "Total": amt, "Reference": ref, "IsReconciled": rec} for i, (t, d, amt, ref, rec) in enumerate(rows)]


def totals(today: dt.date | None = None) -> dict:
    inv, tx = invoices(today), bank_transactions(today)
    income = sum(i["Total"] for i in inv if i["Status"] in ("PAID", "AUTHORISED"))
    spend = sum(t["Total"] for t in tx if t["Type"] == "SPEND")
    received = sum(t["Total"] for t in tx if t["Type"] == "RECEIVE")
    return {"income": income, "care_plans": sum(i["Total"] for i in inv if i["Total"] == 30 and i["Status"] != "DRAFT"),
            "spend": spend, "received": received, "cash": 500 + received - spend, "receivable": sum(i["AmountDue"] for i in inv)}


def _row(label, value=None, kind="Row"):
    cells = [{"Value": label}] + ([{"Value": money(value)}] if value is not None else [])
    return {"RowType": kind, "Cells": cells}


def report(name: str, today: dt.date | None = None) -> dict:
    t = totals(today)
    sales = t["income"] - t["care_plans"]
    if name == "ProfitAndLoss":
        cost = Decimal(t["spend"])
        rows = [{"RowType": "Header", "Cells": [{"Value": ""}, {"Value": "This period"}]},
                {"RowType": "Section", "Title": "Income", "Rows": [_row("Website sales", sales), _row("Care plans", t["care_plans"]), _row("Total Income", t["income"], "SummaryRow")]},
                {"RowType": "Section", "Title": "Less Operating Expenses", "Rows": [_row("Hosting, domains and insurance", cost), _row("Total Operating Expenses", cost, "SummaryRow")]},
                {"RowType": "Section", "Title": "", "Rows": [_row("Net Profit", Decimal(t["income"]) - cost, "SummaryRow")]}]
        return {"Reports": [{"ReportID": "ProfitAndLoss", "ReportName": "Profit and Loss", "Rows": rows}]}
    if name == "BalanceSheet":
        rows = [{"RowType": "Header", "Cells": [{"Value": ""}, {"Value": "Today"}]},
                {"RowType": "Section", "Title": "Assets", "Rows": [_row("Business Current Account", t["cash"]), _row("Accounts Receivable", t["receivable"]),
                                                                   _row("Total Assets", Decimal(t["cash"]) + t["receivable"], "SummaryRow")]},
                {"RowType": "Section", "Title": "Liabilities", "Rows": [_row("Total Liabilities", 0, "SummaryRow")]},
                {"RowType": "Section", "Title": "", "Rows": [_row("Net Assets", Decimal(t["cash"]) + t["receivable"], "SummaryRow")]}]
        return {"Reports": [{"ReportID": "BalanceSheet", "ReportName": "Balance Sheet", "Rows": rows}]}
    rows = [{"RowType": "Header", "Cells": [{"Value": ""}, {"Value": "This month"}]},
            {"RowType": "Section", "Title": "Cash", "Rows": [_row("Cash received", t["received"]), _row("Cash spent", t["spend"]), _row("Cash position", t["cash"], "SummaryRow")]},
            {"RowType": "Section", "Title": "Income", "Rows": [_row("Total Income", t["income"], "SummaryRow")]}]
    return {"Reports": [{"ReportID": "ExecutiveSummary", "ReportName": "Executive Summary", "Rows": rows}]}


# ---- Zelt ----
def zelt_employees() -> list[dict]:
    return [{"id": "emp-1", "name": "Alex Morgan", "role": "Web developer", "department": "Delivery", "monthlyCostGbp": 2450, "startDate": "2025-09-01"},
            {"id": "emp-2", "name": "Sam Patel", "role": "Customer support (part time)", "department": "Support", "monthlyCostGbp": 980, "startDate": "2026-02-16"}]


def zelt_payroll(today: dt.date | None = None) -> list[dict]:
    today = today or dt.date.today()
    runs = []
    for back in range(1, 7):
        d = month_start(today, back)
        n = 2 if (d.year, d.month) >= (2026, 2) else 1
        gross = 2300 + (900 if n == 2 else 0)
        ni, pension = round(gross * 0.138 * 0.6), round(gross * 0.03)
        runs.append({"id": f"run-{d:%Y-%m}", "period": f"{d:%Y-%m}", "totalGross": gross, "totalEmployerNi": ni, "totalPension": pension,
                     "totalCost": gross + ni + pension, "employeeCount": n})
    return runs


def zelt_leave(today: dt.date | None = None) -> list[dict]:
    today = today or dt.date.today()
    s = today + dt.timedelta(days=21)
    return [{"id": "lv-1", "employeeName": "Alex Morgan", "type": "Annual leave", "startDate": s.isoformat(), "endDate": (s + dt.timedelta(days=4)).isoformat(), "status": "PENDING", "days": 5},
            {"id": "lv-2", "employeeName": "Sam Patel", "type": "Sick leave", "startDate": (today - dt.timedelta(days=30)).isoformat(),
             "endDate": (today - dt.timedelta(days=29)).isoformat(), "status": "APPROVED", "days": 2}]


def zelt_expenses(today: dt.date | None = None) -> list[dict]:
    today = today or dt.date.today()
    return [{"id": "ex-1", "employeeName": "Alex Morgan", "category": "Travel", "amount": 23.4, "currency": "GBP", "date": (today - dt.timedelta(days=6)).isoformat(), "status": "PENDING"},
            {"id": "ex-2", "employeeName": "Sam Patel", "category": "Software", "amount": 12.0, "currency": "GBP", "date": (today - dt.timedelta(days=40)).isoformat(), "status": "APPROVED"}]
