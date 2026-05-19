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
  default = "ghcr.io/johndoe6345789/businessplanner"
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
    "nextra-auth",
    "nextra-social",
    "nextra-notifications",
    "nextra-comments",
    "nextra-analytics",
    "nextra-gamification",
    "nextra-content",
    "nextra-media",
    "nextra-search",
    "nextra-infra",
    "nextra-ai",
    "nextra-platform",
    "nextra-commerce",
    "nextra-migrate",
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
  args = {
    NODE_OPTIONS = "--max-old-space-size=2048"
    NPM_REGISTRY = "https://registry.npmjs.org"
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
  args = {
    NODE_OPTIONS = "--max-old-space-size=2048"
    NPM_REGISTRY = "https://registry.npmjs.org"
  }
  tags = [
    "${REGISTRY}/notifications:${TAG}",
    "${REGISTRY}/notifications:latest",
  ]
}

target "image-processor-frontend" {
  context    = "./services/image/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  args = {
    NODE_OPTIONS = "--max-old-space-size=2048"
    NPM_REGISTRY = "https://registry.npmjs.org"
  }
  tags = [
    "${REGISTRY}/image-processor-frontend:${TAG}",
    "${REGISTRY}/image-processor-frontend:latest",
  ]
}

target "shop-admin" {
  context    = "./services/ecommerce/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  args = {
    NODE_OPTIONS = "--max-old-space-size=2048"
    NPM_REGISTRY = "https://registry.npmjs.org"
  }
  tags = [
    "${REGISTRY}/shop-admin:${TAG}",
    "${REGISTRY}/shop-admin:latest",
  ]
}

target "jobs" {
  context    = "./services/job-queue/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  args = {
    NODE_OPTIONS = "--max-old-space-size=2048"
    NPM_REGISTRY = "https://registry.npmjs.org"
  }
  tags = [
    "${REGISTRY}/jobs:${TAG}",
    "${REGISTRY}/jobs:latest",
  ]
}

target "search" {
  context    = "./services/search/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  args = {
    NODE_OPTIONS = "--max-old-space-size=2048"
    NPM_REGISTRY = "https://registry.npmjs.org"
  }
  tags = [
    "${REGISTRY}/search:${TAG}",
    "${REGISTRY}/search:latest",
  ]
}

target "streams" {
  context    = "./services/streaming/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  args = {
    NODE_OPTIONS = "--max-old-space-size=2048"
    NPM_REGISTRY = "https://registry.npmjs.org"
  }
  tags = [
    "${REGISTRY}/streams:${TAG}",
    "${REGISTRY}/streams:latest",
  ]
}

target "cron" {
  context    = "./services/cron/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  args = {
    NODE_OPTIONS = "--max-old-space-size=2048"
    NPM_REGISTRY = "https://registry.npmjs.org"
  }
  tags = [
    "${REGISTRY}/cron:${TAG}",
    "${REGISTRY}/cron:latest",
  ]
}

target "backups" {
  context    = "./services/backup/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  args = {
    NODE_OPTIONS = "--max-old-space-size=2048"
    NPM_REGISTRY = "https://registry.npmjs.org"
  }
  tags = [
    "${REGISTRY}/backups:${TAG}",
    "${REGISTRY}/backups:latest",
  ]
}

target "wiki" {
  context    = "./services/wiki/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  args = {
    NODE_OPTIONS = "--max-old-space-size=2048"
    NPM_REGISTRY = "https://registry.npmjs.org"
  }
  tags = [
    "${REGISTRY}/wiki:${TAG}",
    "${REGISTRY}/wiki:latest",
  ]
}

target "webhooks" {
  context    = "./services/webhooks/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  args = {
    NODE_OPTIONS = "--max-old-space-size=2048"
    NPM_REGISTRY = "https://registry.npmjs.org"
  }
  tags = [
    "${REGISTRY}/webhooks:${TAG}",
    "${REGISTRY}/webhooks:latest",
  ]
}

target "polls" {
  context    = "./services/polls/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  args = {
    NODE_OPTIONS = "--max-old-space-size=2048"
    NPM_REGISTRY = "https://registry.npmjs.org"
  }
  tags = [
    "${REGISTRY}/polls:${TAG}",
    "${REGISTRY}/polls:latest",
  ]
}

target "blog" {
  context    = "./services/blog/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  args = {
    NODE_OPTIONS = "--max-old-space-size=2048"
    NPM_REGISTRY = "https://registry.npmjs.org"
  }
  tags = [
    "${REGISTRY}/blog:${TAG}",
    "${REGISTRY}/blog:latest",
  ]
}

target "audit" {
  context    = "./services/audit/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  args = {
    NODE_OPTIONS = "--max-old-space-size=2048"
    NPM_REGISTRY = "https://registry.npmjs.org"
  }
  tags = [
    "${REGISTRY}/audit:${TAG}",
    "${REGISTRY}/audit:latest",
  ]
}

target "social-admin" {
  context    = "./services/social/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  args = {
    NODE_OPTIONS = "--max-old-space-size=2048"
    NPM_REGISTRY = "https://registry.npmjs.org"
  }
  tags = [
    "${REGISTRY}/social-admin:${TAG}",
    "${REGISTRY}/social-admin:latest",
  ]
}

target "gallery" {
  context    = "./services/gallery/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  args = {
    NODE_OPTIONS = "--max-old-space-size=2048"
    NPM_REGISTRY = "https://registry.npmjs.org"
  }
  tags = [
    "${REGISTRY}/gallery:${TAG}",
    "${REGISTRY}/gallery:latest",
  ]
}

target "flags" {
  context    = "./services/feature-flags/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  args = {
    NODE_OPTIONS = "--max-old-space-size=2048"
    NPM_REGISTRY = "https://registry.npmjs.org"
  }
  tags = [
    "${REGISTRY}/flags:${TAG}",
    "${REGISTRY}/flags:latest",
  ]
}

target "analytics" {
  context    = "./services/analytics/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  args = {
    NODE_OPTIONS = "--max-old-space-size=2048"
    NPM_REGISTRY = "https://registry.npmjs.org"
  }
  tags = [
    "${REGISTRY}/analytics:${TAG}",
    "${REGISTRY}/analytics:latest",
  ]
}

target "status" {
  context    = "./services/status-page/public"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  args = {
    NODE_OPTIONS = "--max-old-space-size=2048"
    NPM_REGISTRY = "https://registry.npmjs.org"
  }
  tags = [
    "${REGISTRY}/status:${TAG}",
    "${REGISTRY}/status:latest",
  ]
}

target "alerts" {
  context    = "./services/alerts/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  args = {
    NODE_OPTIONS = "--max-old-space-size=2048"
    NPM_REGISTRY = "https://registry.npmjs.org"
  }
  tags = [
    "${REGISTRY}/alerts:${TAG}",
    "${REGISTRY}/alerts:latest",
  ]
}

target "forum" {
  context    = "./services/comments/admin"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  args = {
    NODE_OPTIONS = "--max-old-space-size=2048"
    NPM_REGISTRY = "https://registry.npmjs.org"
  }
  tags = [
    "${REGISTRY}/forum:${TAG}",
    "${REGISTRY}/forum:latest",
  ]
}

# -----------------------------------------------------------------
# emailclient — Next.js webmail UI. The former Flask email-service
# (emailclient-api) is now the C++ email domain inside nextra-api.
# -----------------------------------------------------------------
target "emailclient" {
  context    = "./services/email/webmail"
  dockerfile = "Dockerfile"
  contexts   = { shared = "./shared" }
  args = {
    NODE_OPTIONS = "--max-old-space-size=2048"
    NPM_REGISTRY = "https://registry.npmjs.org"
  }
  tags = [
    "${REGISTRY}/emailclient:${TAG}",
    "${REGISTRY}/emailclient:latest",
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
  args = {
    NODE_OPTIONS = "--max-old-space-size=2048"
    NPM_REGISTRY = "https://registry.npmjs.org"
  }
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
  args = {
    NODE_OPTIONS = "--max-old-space-size=2048"
    NPM_REGISTRY = "https://registry.npmjs.org"
  }
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
  args = {
    NODE_OPTIONS = "--max-old-space-size=2048"
    NPM_REGISTRY = "https://registry.npmjs.org"
  }
  tags = [
    "${REGISTRY}/pgadmin-frontend:${TAG}",
    "${REGISTRY}/pgadmin-frontend:latest",
  ]
}

# ── Microservice targets (per-service Dockerfiles) ──

target "nextra-auth" {
  context    = "."
  dockerfile = "services/auth-service/Dockerfile"
  args = {
    RUNTIME_IMAGE = "debian:sid-slim"
    SVC_NAME      = "nextra-auth"
    SVC_DIR       = "auth-service"
    SVC_PORT      = "9001"
  }
  tags = [
    "${REGISTRY}/nextra-auth:${TAG}",
    "${REGISTRY}/nextra-auth:latest",
  ]
}

target "nextra-social" {
  context    = "."
  dockerfile = "services/social-service/Dockerfile"
  args = {
    RUNTIME_IMAGE = "debian:sid-slim"
    SVC_NAME      = "nextra-social"
    SVC_DIR       = "social-service"
    SVC_PORT      = "9002"
  }
  tags = [
    "${REGISTRY}/nextra-social:${TAG}",
    "${REGISTRY}/nextra-social:latest",
  ]
}

target "nextra-notifications" {
  context    = "."
  dockerfile = "services/notifications-service/Dockerfile"
  args = {
    RUNTIME_IMAGE = "debian:sid-slim"
    SVC_NAME      = "nextra-notifications"
    SVC_DIR       = "notifications-service"
    SVC_PORT      = "9003"
  }
  tags = [
    "${REGISTRY}/nextra-notifications:${TAG}",
    "${REGISTRY}/nextra-notifications:latest",
  ]
}

target "nextra-comments" {
  context    = "."
  dockerfile = "services/comments-service/Dockerfile"
  args = {
    RUNTIME_IMAGE = "debian:sid-slim"
    SVC_NAME      = "nextra-comments"
    SVC_DIR       = "comments-service"
    SVC_PORT      = "9004"
  }
  tags = [
    "${REGISTRY}/nextra-comments:${TAG}",
    "${REGISTRY}/nextra-comments:latest",
  ]
}

target "nextra-analytics" {
  context    = "."
  dockerfile = "services/analytics-service/Dockerfile"
  args = {
    RUNTIME_IMAGE = "debian:sid-slim"
    SVC_NAME      = "nextra-analytics"
    SVC_DIR       = "analytics-service"
    SVC_PORT      = "9005"
  }
  tags = [
    "${REGISTRY}/nextra-analytics:${TAG}",
    "${REGISTRY}/nextra-analytics:latest",
  ]
}

target "nextra-gamification" {
  context    = "."
  dockerfile = "services/gamification-service/Dockerfile"
  args = {
    RUNTIME_IMAGE = "debian:sid-slim"
    SVC_NAME      = "nextra-gamification"
    SVC_DIR       = "gamification-service"
    SVC_PORT      = "9006"
  }
  tags = [
    "${REGISTRY}/nextra-gamification:${TAG}",
    "${REGISTRY}/nextra-gamification:latest",
  ]
}

target "nextra-content" {
  context    = "."
  dockerfile = "services/content-service/Dockerfile"
  args = {
    RUNTIME_IMAGE = "debian:sid-slim"
    SVC_NAME      = "nextra-content"
    SVC_DIR       = "content-service"
    SVC_PORT      = "9007"
  }
  tags = [
    "${REGISTRY}/nextra-content:${TAG}",
    "${REGISTRY}/nextra-content:latest",
  ]
}

target "nextra-media" {
  context    = "."
  dockerfile = "services/media-service/Dockerfile"
  args = {
    RUNTIME_IMAGE = "debian:sid-slim"
    SVC_NAME      = "nextra-media"
    SVC_DIR       = "media-service"
    SVC_PORT      = "9008"
  }
  tags = [
    "${REGISTRY}/nextra-media:${TAG}",
    "${REGISTRY}/nextra-media:latest",
  ]
}

target "nextra-search" {
  context    = "."
  dockerfile = "services/search-service/Dockerfile"
  args = {
    RUNTIME_IMAGE = "debian:sid-slim"
    SVC_NAME      = "nextra-search"
    SVC_DIR       = "search-service"
    SVC_PORT      = "9009"
  }
  tags = [
    "${REGISTRY}/nextra-search:${TAG}",
    "${REGISTRY}/nextra-search:latest",
  ]
}

target "nextra-infra" {
  context    = "."
  dockerfile = "services/infra-service/Dockerfile"
  args = {
    RUNTIME_IMAGE = "debian:sid-slim"
    SVC_NAME      = "nextra-infra"
    SVC_DIR       = "infra-service"
    SVC_PORT      = "9010"
  }
  tags = [
    "${REGISTRY}/nextra-infra:${TAG}",
    "${REGISTRY}/nextra-infra:latest",
  ]
}

target "nextra-ai" {
  context    = "."
  dockerfile = "services/ai-service/Dockerfile"
  args = {
    RUNTIME_IMAGE = "debian:sid-slim"
    SVC_NAME      = "nextra-ai"
    SVC_DIR       = "ai-service"
    SVC_PORT      = "9011"
  }
  tags = [
    "${REGISTRY}/nextra-ai:${TAG}",
    "${REGISTRY}/nextra-ai:latest",
  ]
}

target "nextra-platform" {
  context    = "."
  dockerfile = "services/platform-service/Dockerfile"
  args = {
    RUNTIME_IMAGE = "debian:sid-slim"
    SVC_NAME      = "nextra-platform"
    SVC_DIR       = "platform-service"
    SVC_PORT      = "9012"
  }
  tags = [
    "${REGISTRY}/nextra-platform:${TAG}",
    "${REGISTRY}/nextra-platform:latest",
  ]
}

target "nextra-commerce" {
  context    = "."
  dockerfile = "services/commerce-service/Dockerfile"
  args = {
    RUNTIME_IMAGE = "debian:sid-slim"
    SVC_NAME      = "nextra-commerce"
    SVC_DIR       = "commerce-service"
    SVC_PORT      = "9013"
  }
  tags = [
    "${REGISTRY}/nextra-commerce:${TAG}",
    "${REGISTRY}/nextra-commerce:latest",
  ]
}

target "nextra-migrate" {
  context    = "."
  dockerfile = "services/migrate-service/Dockerfile"
  args = {
    RUNTIME_IMAGE = "debian:sid-slim"
    SVC_NAME      = "nextra-migrate"
    SVC_DIR       = "migrate-service"
    SVC_PORT      = "9099"
  }
  tags = [
    "${REGISTRY}/nextra-migrate:${TAG}",
    "${REGISTRY}/nextra-migrate:latest",
  ]
}
