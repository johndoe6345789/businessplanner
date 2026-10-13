"""Xero (accounting) and Zelt (payroll) integrations.

Both need OAuth credentials from the provider, which this deployment does not have. Rather than leave the
accounting pages calling routes that 404, they report 'not connected' and say why connecting is unavailable."""
from fastapi import APIRouter

from .core import ApiError
from .http import User

router = APIRouter()

DATA = {"xero": ["invoices", "transactions", "reports/profit-loss", "reports/balance-sheet", "reports/cash-flow"],
        "zelt": ["payroll", "employees", "leave", "expenses"]}
LABEL = {"xero": "Xero", "zelt": "Zelt"}


def mount(name: str):
    @router.get(f"/api/{name}/status")
    async def status(uid: str = User):
        return {"connected": False}

    @router.post(f"/api/{name}/connect")
    async def connect(uid: str = User):
        raise ApiError(501, f"{LABEL[name]} is not set up on this server (no provider credentials are configured).")

    @router.delete(f"/api/{name}/disconnect")
    async def disconnect(uid: str = User):
        return {}

    for path in DATA[name]:
        def make(path=path):
            @router.get(f"/api/{name}/{path}")
            async def data(uid: str = User):
                raise ApiError(409, f"Not connected to {LABEL[name]}.")
            return data
        make()


for _name in DATA:
    mount(_name)
