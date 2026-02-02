# Makefile for Pendek.in Monorepo
# ================================

.PHONY: help install dev build start lint format typecheck clean generate-api turbo-clean
.PHONY: dev-web dev-backend build-web build-backend
.PHONY: backend-run backend-watch backend-test backend-lint backend-fmt
.PHONY: backend-sqlc backend-swagger backend-deps backend-tidy
.PHONY: migrate-up migrate-down migrate-status migrate-reset migrate-create
.PHONY: backend-setup backend-ci backend-build-all

# Backend directory
BACKEND_DIR=apps/backend

# Default target
help:
	@echo "Pendek.in - URL Shortener Monorepo"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Development:"
	@echo "  install           Install all dependencies (pnpm + go)"
	@echo "  dev               Start all dev servers (web + backend)"
	@echo "  dev-web           Start web app dev server only"
	@echo "  dev-backend       Start backend dev server only"
	@echo "  build             Build all packages"
	@echo "  build-web         Build web app only"
	@echo "  build-backend     Build backend binary"
	@echo "  start             Start production server (web)"
	@echo ""
	@echo "Backend:"
	@echo "  backend-run       Run backend server"
	@echo "  backend-watch     Run backend with hot reload (air)"
	@echo "  backend-test      Run backend tests"
	@echo "  backend-lint      Run golangci-lint"
	@echo "  backend-fmt       Format Go code"
	@echo "  backend-sqlc      Generate Go code from SQL"
	@echo "  backend-swagger   Generate Swagger documentation"
	@echo "  backend-deps      Download Go dependencies"
	@echo "  backend-tidy      Tidy Go modules"
	@echo "  backend-setup     Install backend dev tools"
	@echo "  backend-ci        Run all backend CI checks"
	@echo ""
	@echo "Database Migrations:"
	@echo "  migrate-up        Run all database migrations"
	@echo "  migrate-down      Rollback the last migration"
	@echo "  migrate-status    Show migration status"
	@echo "  migrate-reset     Rollback all migrations"
	@echo "  migrate-create    Create migration (name=migration_name)"
	@echo ""
	@echo "Code Quality:"
	@echo "  lint              Run linters (ESLint + golangci-lint)"
	@echo "  lint-fix          Run ESLint with auto-fix"
	@echo "  format            Format all code (Prettier + gofmt)"
	@echo "  format-check      Check formatting without changes"
	@echo "  typecheck         Run TypeScript type checking"
	@echo ""
	@echo "API Client:"
	@echo "  generate-api      Generate API client from swagger.yaml"
	@echo ""
	@echo "Utilities:"
	@echo "  clean             Remove build artifacts and dependencies"
	@echo "  clean-build       Remove only build artifacts"
	@echo "  turbo-clean       Remove Turbo cache"
	@echo "  reset             Full reset (clean + reinstall)"

# ============
# Development
# ============

install:
	pnpm install
	cd $(BACKEND_DIR) && go mod download

dev:
	@echo "Starting web and backend servers..."
	@$(MAKE) -j2 dev-web dev-backend

dev-web:
	pnpm turbo run dev --filter=@pendek-in/web

dev-backend:
	cd $(BACKEND_DIR) && $(MAKE) run-watch

build:
	pnpm turbo run build
	cd $(BACKEND_DIR) && $(MAKE) build

build-web:
	pnpm turbo run build --filter=@pendek-in/web

build-backend:
	cd $(BACKEND_DIR) && $(MAKE) build

start:
	pnpm --filter=@pendek-in/web run start

# ============
# Backend
# ============

backend-run:
	cd $(BACKEND_DIR) && $(MAKE) run

backend-watch:
	cd $(BACKEND_DIR) && $(MAKE) run-watch

backend-test:
	cd $(BACKEND_DIR) && $(MAKE) test

backend-lint:
	cd $(BACKEND_DIR) && $(MAKE) lint

backend-fmt:
	cd $(BACKEND_DIR) && $(MAKE) fmt

backend-sqlc:
	cd $(BACKEND_DIR) && $(MAKE) sqlc

backend-swagger:
	cd $(BACKEND_DIR) && $(MAKE) swagger

backend-deps:
	cd $(BACKEND_DIR) && $(MAKE) deps

backend-tidy:
	cd $(BACKEND_DIR) && $(MAKE) tidy

backend-setup:
	cd $(BACKEND_DIR) && $(MAKE) setup

backend-ci:
	cd $(BACKEND_DIR) && $(MAKE) ci

backend-build-all:
	cd $(BACKEND_DIR) && $(MAKE) build-all

# ============
# Database Migrations
# ============

migrate-up:
	cd $(BACKEND_DIR) && $(MAKE) migrate-up

migrate-down:
	cd $(BACKEND_DIR) && $(MAKE) migrate-down

migrate-status:
	cd $(BACKEND_DIR) && $(MAKE) migrate-status

migrate-reset:
	cd $(BACKEND_DIR) && $(MAKE) migrate-reset

migrate-create:
	cd $(BACKEND_DIR) && $(MAKE) migrate-create name=$(name)

# ============
# Code Quality
# ============

lint:
	pnpm turbo run lint
	cd $(BACKEND_DIR) && $(MAKE) lint

lint-fix:
	pnpm turbo run lint -- --fix

format:
	pnpm exec prettier --write "apps/web/**/*.{ts,tsx,js,jsx,json,md,css}" "packages/**/*.{ts,tsx,js,jsx,json,md,css}"
	cd $(BACKEND_DIR) && $(MAKE) fmt

format-check:
	pnpm exec prettier --check "apps/web/**/*.{ts,tsx,js,jsx,json,md,css}" "packages/**/*.{ts,tsx,js,jsx,json,md,css}"

typecheck:
	pnpm --filter=@pendek-in/web exec tsc --noEmit

typecheck-all:
	pnpm turbo run typecheck

# ============
# API Client
# ============

generate-api:
	pnpm --filter=@pendek-in/web run generate-api

# ============
# Utilities
# ============

clean:
	rm -rf node_modules
	rm -rf apps/*/node_modules
	rm -rf packages/*/node_modules
	rm -rf apps/web/.next
	rm -rf apps/web/out
	rm -rf apps/backend/bin
	rm -rf apps/backend/tmp
	rm -rf .turbo
	rm -rf apps/*/.turbo
	rm -rf packages/*/.turbo

clean-build:
	rm -rf apps/web/.next
	rm -rf apps/web/out
	rm -rf apps/backend/bin
	rm -rf .turbo
	rm -rf apps/*/.turbo
	rm -rf packages/*/.turbo

turbo-clean:
	rm -rf .turbo
	rm -rf apps/*/.turbo
	rm -rf packages/*/.turbo

reset: clean install
