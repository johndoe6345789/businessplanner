# businessplanner-planner: the LaunchPad planning tools API (KPIs, OKRs, risks, decisions, market
# research, financial tools, ...). Build context: this directory.
FROM python:3.12-slim AS test
WORKDIR /srv
COPY requirements-dev.txt requirements.txt ./
RUN pip install --no-cache-dir -r requirements-dev.txt
COPY app ./app
COPY tests ./tests
RUN python -m pytest -q tests

FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1
WORKDIR /srv
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt \
 && groupadd --system planner && useradd --system --gid planner planner
COPY app ./app
USER planner
EXPOSE 9015
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "9015", "--no-access-log"]
