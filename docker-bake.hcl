# =================================================================
# Nextra Docker Bake — image push for all 31 services
# =================================================================
# Variables injected by CI (see .github/workflows/build-and-push.yml):
#   REGISTRY  — ghcr.io/<owner>/next_extra_primary  (or Nexus host)
#   TAG       — sha-<short-sha>
#
# Local usage:
#   REGISTRY=ghcr.io/you/next_extra_primary TAG=dev \
#     docker buildx bake \
#       -f docker-compose.yml -f docker-bake.hcl
#
# Every target sets its own context/dockerfile. The Next.js admin/public
# UIs use the convention: context = the service dir, plus a `shared`
# additional context = ./shared (Dockerfile does
# `COPY --from=shared . /build/shared/`). The C++ backends keep their
# build context at the parent dir with dockerfile = backend/Dockerfile
# (their Dockerfiles `COPY backend/...`).
# =================================================================

variable "REGISTRY" {
  default = "ghcr.io/johndoe6345789/next_extra_primary"
}

variable "TAG" {
  default = "latest"
}

# -----------------------------------------------------------------
# Default group — all 31 unique service images
# -----------------------------------------------------------------
group "default" {
  targets = [
    "nextra-api",
    "emailclient-api",
    "emailclient",
    "notifications",
    "image-processor-frontend",
    "shop-admin",
    "jobs",
    "search",
    "streams",
    "cron",
    "backups",
    "wiki",
    "webhooks",
    "polls",
    "blog",
    "frontend",
    "sso",
    "audit",
    "social-admin",
    "gallery",
    "flags",
    "analytics",
    "status",
    "alerts",
    "forum",
    "s3",
    "s3-frontend",
    "packagerepo-backend",
    "packagerepo-frontend",
    "pgadmin-backend",
    "pgadmin-frontend",
  ]
}

# -----------------------------------------------------------------
# nextra-api — Drogon C++ backend (shared by 13 compose services)
# -----------------------------------------------------------------
target "nextra-api" {
  context    = "."
  dockerfile = "services/drogon-host/Dockerfile"
  contexts = {
    manager  = "services/manager-cli/cli"
    commands = ".local/commands"
  }
  args = {
    DEPS_IMAGE    = "${REGISTRY}/nextra-base-conan:latest"
    APT_IMAGE     = "${REGISTRY}/nextra-base-apt:latest"
    RUNTIME_IMAGE = "debian:sid-slim"
  }
  tags = [
    "${REGISTRY}/nextra-api:${TAG}",
    "${REGISTRY}/nextra-api:latest",
  ]
}

# -----------------------------------------------------------------
# frontend — Next.js app (production Dockerfile)
# -----------------------------------------------------------------
target "frontend" {
  context    = "./frontend"
  dockerfile = "Dockerfile"
  contexts = {
    shared = "./shared"
  }
  tags = [
    "${REGISTRY}/frontend:${TAG}",
    "${REGISTRY}/frontend:latest",
  ]
}

# -----------------------------------------------------------------
# sso — build config comes from docker-compose.yml
# (service `sso`, context ./services/sso/portal). Tags only here.
# -----------------------------------------------------------------
target "sso" {
  tags = [
    "${REGISTRY}/sso:${TAG}",
    "${REGISTRY}/sso:latest",
  ]
}

# -----------------------------------------------------------------
# Next.js admin/public UIs — context = service dir, shared = ./shared
# (NEXT_BASE_PATH is already defaulted per service in each Dockerfile)
# -----------------------------------------------------------------
target "notifications" {
  context    = "./services/notifications/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  tags = [
    "${REGISTRY}/notifications:${TAG}",
    "${REGISTRY}/notifications:latest",
  ]
}

target "image-processor-frontend" {
  context    = "./services/image/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  tags = [
    "${REGISTRY}/image-processor-frontend:${TAG}",
    "${REGISTRY}/image-processor-frontend:latest",
  ]
}

target "shop-admin" {
  context    = "./services/ecommerce/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  tags = [
    "${REGISTRY}/shop-admin:${TAG}",
    "${REGISTRY}/shop-admin:latest",
  ]
}

target "jobs" {
  context    = "./services/job-queue/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  tags = [
    "${REGISTRY}/jobs:${TAG}",
    "${REGISTRY}/jobs:latest",
  ]
}

target "search" {
  context    = "./services/search/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  tags = [
    "${REGISTRY}/search:${TAG}",
    "${REGISTRY}/search:latest",
  ]
}

target "streams" {
  context    = "./services/streaming/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  tags = [
    "${REGISTRY}/streams:${TAG}",
    "${REGISTRY}/streams:latest",
  ]
}

target "cron" {
  context    = "./services/cron/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  tags = [
    "${REGISTRY}/cron:${TAG}",
    "${REGISTRY}/cron:latest",
  ]
}

target "backups" {
  context    = "./services/backup/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  tags = [
    "${REGISTRY}/backups:${TAG}",
    "${REGISTRY}/backups:latest",
  ]
}

target "wiki" {
  context    = "./services/wiki/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  tags = [
    "${REGISTRY}/wiki:${TAG}",
    "${REGISTRY}/wiki:latest",
  ]
}

target "webhooks" {
  context    = "./services/webhooks/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  tags = [
    "${REGISTRY}/webhooks:${TAG}",
    "${REGISTRY}/webhooks:latest",
  ]
}

target "polls" {
  context    = "./services/polls/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  tags = [
    "${REGISTRY}/polls:${TAG}",
    "${REGISTRY}/polls:latest",
  ]
}

target "blog" {
  context    = "./services/blog/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  tags = [
    "${REGISTRY}/blog:${TAG}",
    "${REGISTRY}/blog:latest",
  ]
}

target "audit" {
  context    = "./services/audit/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  tags = [
    "${REGISTRY}/audit:${TAG}",
    "${REGISTRY}/audit:latest",
  ]
}

target "social-admin" {
  context    = "./services/social/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  tags = [
    "${REGISTRY}/social-admin:${TAG}",
    "${REGISTRY}/social-admin:latest",
  ]
}

target "gallery" {
  context    = "./services/gallery/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  tags = [
    "${REGISTRY}/gallery:${TAG}",
    "${REGISTRY}/gallery:latest",
  ]
}

target "flags" {
  context    = "./services/feature-flags/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  tags = [
    "${REGISTRY}/flags:${TAG}",
    "${REGISTRY}/flags:latest",
  ]
}

target "analytics" {
  context    = "./services/analytics/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  tags = [
    "${REGISTRY}/analytics:${TAG}",
    "${REGISTRY}/analytics:latest",
  ]
}

target "status" {
  context    = "./services/status-page/public"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  tags = [
    "${REGISTRY}/status:${TAG}",
    "${REGISTRY}/status:latest",
  ]
}

target "alerts" {
  context    = "./services/alerts/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  tags = [
    "${REGISTRY}/alerts:${TAG}",
    "${REGISTRY}/alerts:latest",
  ]
}

target "forum" {
  context    = "./services/comments/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  tags = [
    "${REGISTRY}/forum:${TAG}",
    "${REGISTRY}/forum:latest",
  ]
}

# -----------------------------------------------------------------
# emailclient — Next.js webmail UI; emailclient-api — its service
# -----------------------------------------------------------------
target "emailclient" {
  context    = "./services/email/webmail"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  tags = [
    "${REGISTRY}/emailclient:${TAG}",
    "${REGISTRY}/emailclient:latest",
  ]
}

target "emailclient-api" {
  context    = "./services/email/webmail/deployment/docker/email-service"
  dockerfile = "Dockerfile"
  tags = [
    "${REGISTRY}/emailclient-api:${TAG}",
    "${REGISTRY}/emailclient-api:latest",
  ]
}

# -----------------------------------------------------------------
# object-store (S3-compatible) — C++ backend + Next.js frontend
# -----------------------------------------------------------------
target "s3" {
  context    = "./services/object-store/server"
  dockerfile = "backend/Dockerfile"
  tags = [
    "${REGISTRY}/s3:${TAG}",
    "${REGISTRY}/s3:latest",
  ]
}

target "s3-frontend" {
  context    = "./services/object-store/server/frontend"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  tags = [
    "${REGISTRY}/s3-frontend:${TAG}",
    "${REGISTRY}/s3-frontend:latest",
  ]
}

# -----------------------------------------------------------------
# package-repository — C++ backend (Conan) + Next.js frontend
# -----------------------------------------------------------------
target "packagerepo-backend" {
  context    = "./services/package-repository/root"
  dockerfile = "backend/Dockerfile"
  args = {
    DEPS_IMAGE    = "${REGISTRY}/nextra-base-conan:latest"
    RUNTIME_IMAGE = "debian:sid-slim"
  }
  tags = [
    "${REGISTRY}/packagerepo-backend:${TAG}",
    "${REGISTRY}/packagerepo-backend:latest",
  ]
}

target "packagerepo-frontend" {
  context    = "./services/package-repository/root/frontend"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  tags = [
    "${REGISTRY}/packagerepo-frontend:${TAG}",
    "${REGISTRY}/packagerepo-frontend:latest",
  ]
}

# -----------------------------------------------------------------
# pgadmin — database admin: C++ backend + Next.js frontend
# -----------------------------------------------------------------
target "pgadmin-backend" {
  context    = "./services/database/admin"
  dockerfile = "backend/Dockerfile"
  tags = [
    "${REGISTRY}/pgadmin-backend:${TAG}",
    "${REGISTRY}/pgadmin-backend:latest",
  ]
}

target "pgadmin-frontend" {
  context    = "./services/database/admin/frontend"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  tags = [
    "${REGISTRY}/pgadmin-frontend:${TAG}",
    "${REGISTRY}/pgadmin-frontend:latest",
  ]
}
