# Makefile for Pendek.in URL Shortener
# ====================================

.PHONY: help install dev build start lint format clean generate-api docker-build docker-up docker-down

# Default target
help:
	@echo "Pendek.in - URL Shortener"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Development:"
	@echo "  install       Install dependencies"
	@echo "  dev           Start development server"
	@echo "  build         Build for production"
	@echo "  start         Start production server"
	@echo ""
	@echo "Code Quality:"
	@echo "  lint          Run ESLint"
	@echo "  format        Format code with Prettier"
	@echo "  typecheck     Run TypeScript type checking"
	@echo ""
	@echo "API Client:"
	@echo "  generate-api  Generate API client from swagger.yaml"
	@echo ""
	@echo "Utilities:"
	@echo "  clean         Remove build artifacts and node_modules"
	@echo "  clean-build   Remove only build artifacts"

# ============
# Development
# ============

install:
	pnpm install

dev:
	pnpm run dev

build:
	pnpm run build

start:
	pnpm run start

# ============
# Code Quality
# ============

lint:
	pnpm run lint

lint-fix:
	pnpm run lint --fix

format:
	pnpm exec prettier --write "**/*.{ts,tsx,js,jsx,json,md}"

typecheck:
	pnpm exec tsc --noEmit

# ============
# API Client
# ============

generate-api:
	pnpm run generate-api

# ============
# Utilities
# ============

clean:
	rm -rf node_modules
	rm -rf .next
	rm -rf out

clean-build:
	rm -rf .next
	rm -rf out
