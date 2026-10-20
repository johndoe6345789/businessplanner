# Stand-in Xero and Zelt services (sample data, no account needed). One image, two entry points:
#   uvicorn app.xero:app --port 9020      uvicorn app.zelt:app --port 9021
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
RUN pip install --no-cache-dir -r requirements.txt && groupadd --system sur && useradd --system --gid sur sur
COPY app ./app
USER sur
CMD ["uvicorn", "app.xero:app", "--host", "0.0.0.0", "--port", "9020", "--no-access-log"]
