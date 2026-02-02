# Pendek.in

A modern URL shortener with analytics, built as a monorepo with Next.js and Go.

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4, Motion
- **Backend**: Go with Swagger/OpenAPI
- **Monorepo**: Turborepo, pnpm workspaces
- **Database**: SQL with migrations (sqlc)

## Prerequisites

- Node.js 20+
- pnpm 9.15+
- Go 1.21+

## Getting Started

```bash
# Install dependencies
make install

# Start development servers (web + backend)
make dev

# Or start individually
make dev-web      # Frontend only
make dev-backend  # Backend only
```

## Project Structure

```
pendek-in/
├── apps/
│   ├── web/          # Next.js frontend
│   └── backend/      # Go API server
├── packages/         # Shared packages
├── Makefile          # Development commands
├── turbo.json        # Turborepo config
└── pnpm-workspace.yaml
```

## Available Commands

Run `make help` to see all available commands. Key commands:

| Command             | Description                      |
| ------------------- | -------------------------------- |
| `make install`      | Install all dependencies         |
| `make dev`          | Start all dev servers            |
| `make build`        | Build all packages               |
| `make lint`         | Run linters                      |
| `make format`       | Format code                      |
| `make generate-api` | Generate API client from swagger |

### Database Migrations

```bash
make migrate-up       # Run migrations
make migrate-down     # Rollback last migration
make migrate-status   # Show migration status
make migrate-create name=create_users  # Create new migration
```

### Backend Commands

```bash
make backend-test     # Run tests
make backend-lint     # Run golangci-lint
make backend-swagger  # Generate Swagger docs
make backend-sqlc     # Generate Go code from SQL
```

## License

MIT
