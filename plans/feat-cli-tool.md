# feat: Implement Go CLI tool for Pendek.in

## Overview

Build a standalone Go CLI tool (`pendek`) at `apps/cli/` that lets users shorten URLs, manage links, and view analytics from the terminal. The CLI consumes the existing backend REST API and lives as a separate Go module in the Turborepo monorepo -- no backend changes required.

The landing page already has a commented-out terminal demo (`apps/web/app/page.tsx:346-387`) showing the envisioned UX:

```
$ pendek shorten https://my-very-long-url.com/path
→ pendek.in/x7k9m2

$ pendek share x7k9m2
→ Link copied to clipboard

$ pendek stats x7k9m2
→ 1,247 clicks | 32 countries | 89% mobile
```

## Technical Approach

### Architecture

The CLI is a **pure API consumer** -- it makes HTTP requests to the existing backend, stores auth tokens locally, and formats output for the terminal. No shared Go packages with the backend.

```
apps/cli/                          # New Go module
  cmd/pendek/main.go               # Entry point
  internal/
    command/                        # Cobra commands
      root.go
      login.go
      logout.go
      whoami.go
      shorten.go
      list.go
      stats.go
      delete.go
      config_cmd.go
      version.go
    client/                         # HTTP API client
      client.go                     # Base client with auth, retry, timeout
      auth.go                       # Login, refresh token
      links.go                      # Links CRUD
      analytics.go                  # Analytics/stats
      types.go                      # Request/response types
    config/                         # Config + token storage
      config.go                     # Viper-based config management
      tokens.go                     # Token persistence (file-based, 0600)
    output/                         # Output formatting
      table.go                      # lipgloss table rendering
      json.go                       # JSON output
      printer.go                    # Success/error/warning helpers with color
  go.mod
  go.sum
  Makefile
  .goreleaser.yaml
```

### Dependencies

```
github.com/spf13/cobra             v1.9.1    # CLI framework
github.com/spf13/viper             v1.20.1   # Config management
github.com/hashicorp/go-retryablehttp v0.7.7 # HTTP client with retry
github.com/charmbracelet/lipgloss  v1.1.0    # Table output + styling
github.com/charmbracelet/huh       v0.6.0    # Interactive prompts (login)
github.com/fatih/color             v1.18.0   # Colored output
github.com/atotto/clipboard        v0.1.4    # Clipboard copy
```

Zero shared code with `apps/backend/` -- the CLI is an independent module.

### API Endpoints Consumed

Based on `apps/backend/docs/swagger.yaml` and `apps/backend/main.go:182-218`:

| Command         | Method | Endpoint                           | Auth |
| --------------- | ------ | ---------------------------------- | ---- |
| `login`         | POST   | `/auth/login`                      | No   |
| `whoami`        | GET    | `/auth/me`                         | Yes  |
| `shorten`       | POST   | `/links/create`                    | Yes  |
| `list`          | GET    | `/links/all?page=&limit=&orderBy=` | Yes  |
| `stats`         | GET    | `/analytics/?range=`               | Yes  |
| `delete`        | DELETE | `/links/:id`                       | Yes  |
| (token refresh) | POST   | `/auth/refresh`                    | No   |

### Authentication Flow

1. `pendek login` prompts for email/password via `charmbracelet/huh`
2. POST `/auth/login` returns `{token, refresh_token, token_expired_at, refresh_token_expired_at, user}`
3. Tokens stored in `~/.config/pendek-in/credentials.json` with `0600` permissions
4. Every authenticated request checks token expiry locally; auto-refreshes via `/auth/refresh` if expired
5. If refresh token also expired → error: "Session expired. Run `pendek login` to re-authenticate."

**Token storage format** (`~/.config/pendek-in/credentials.json`):

```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "access_token_expires_at": "2025-02-16T12:00:00Z",
  "refresh_token_expires_at": "2025-03-15T12:00:00Z"
}
```

### Config Management

**Config file** (`~/.config/pendek-in/config.yaml`):

```yaml
api_url: https://link.andriawan.dev # default
default_output: table # table | json
```

**Precedence** (Viper): CLI flag > env var (`PENDEK_API_URL`) > config file > default

### Implementation Phases

#### Phase 1: Foundation

Set up the Go module, project structure, and core infrastructure.

- [ ] Initialize `apps/cli/` with `go mod init`
- [ ] Create `cmd/pendek/main.go` entry point
- [ ] Set up Cobra root command with persistent flags (`--api-url`, `--json`, `--no-color`)
- [ ] Implement `internal/config/` -- Viper config + XDG-compliant paths
- [ ] Implement `internal/config/tokens.go` -- token read/write with `0600` perms
- [ ] Implement `internal/client/client.go` -- base HTTP client with:
  - Configurable base URL
  - `Authorization: Bearer` header injection
  - 30s timeout
  - Retry via `go-retryablehttp` (3 retries, 500ms-5s backoff)
  - Auto token refresh on expiry
  - User-Agent: `pendek-cli/{version}`
- [ ] Implement `internal/client/types.go` -- request/response structs matching API contract:
  - `BaseResponse[T]` with `message` + `data` fields
  - `LoginRequest`, `LoginResponse`
  - `LinkResponse`, `InsertLinkRequest`
  - `AnalyticsResponse`, `DashboardResponse`
- [ ] Implement `internal/output/printer.go` -- colored success/error/warning helpers
- [ ] Implement `pendek version` command
- [ ] Create `Makefile` with `build`, `test`, `lint`, `install`, `clean` targets
- [ ] Add `cli-*` targets to root `Makefile`

#### Phase 2: Core Commands

Implement all user-facing commands.

- [ ] `pendek login` -- interactive email/password prompt via `huh`, store tokens
- [ ] `pendek logout` -- clear stored tokens
- [ ] `pendek whoami` -- GET `/auth/me`, display name + email + verified status
- [ ] `pendek shorten <url>` -- POST `/links/create`
  - Flags: `--code` (custom short code), `--expires` (ISO 8601 date YYYY-MM-DD), `--copy` (clipboard)
  - Output: full short URL (e.g., `https://link.andriawan.dev/x7k9m2`)
  - Validate URL has http/https scheme before sending
- [ ] `pendek list` -- GET `/links/all`
  - Flags: `--page` (default 1), `--limit` (default 10), `--order-by` (created_at|counts)
  - Table columns: Short Code, Original URL (truncated 50 chars), Clicks, Created
  - Empty state: "No links yet. Create one with: pendek shorten <url>"
  - `--json` flag outputs raw API response
- [ ] `pendek stats` -- GET `/analytics/?range=30d`
  - Flags: `--range` (7d|30d|90d|all, default 30d)
  - Summary output: total clicks, active links, avg daily clicks, top link
  - Device breakdown table, top countries table
  - `--json` flag for raw output
- [ ] `pendek delete <id>` -- DELETE `/links/:id`
  - Confirmation prompt: "Delete link pendek.in/x7k? This cannot be undone. [y/N]"
  - `--yes` flag to skip confirmation (for scripting)
  - Accepts UUID (validated with regex)
- [ ] `pendek config set <key> <value>` -- update config file
- [ ] `pendek config get <key>` -- read config value
- [ ] `pendek config list` -- show all config

#### Phase 3: Polish & Distribution

- [ ] Implement `internal/output/table.go` -- lipgloss table rendering for list and stats
- [ ] Add usage examples to all command help text
- [ ] Respect `NO_COLOR` env var and `--no-color` flag; auto-detect TTY for color
- [ ] Handle Ctrl+C gracefully (context cancellation on in-flight requests)
- [ ] Create `.goreleaser.yaml` for cross-platform builds (linux/darwin/windows, amd64/arm64)
- [ ] Add `ldflags` version injection (version, commit, date)
- [ ] Write tests:
  - Unit: config parsing, URL validation, output formatting
  - Integration: API client against `httptest.Server` (mock 200, 401, 404, 409, 500)
  - E2E: Cobra command execution with captured stdout/stderr
- [ ] Uncomment terminal demo on landing page (`apps/web/app/page.tsx:346-387`) and update command examples to match actual CLI syntax

## Decisions & Rationale

| Decision           | Choice                              | Why                                                                        |
| ------------------ | ----------------------------------- | -------------------------------------------------------------------------- |
| CLI framework      | Cobra + Viper                       | Industry standard (used by gh, kubectl, docker); native config integration |
| Separate Go module | Yes                                 | CLI is a pure API consumer, no shared code with backend                    |
| Token storage      | File-based (`~/.config/pendek-in/`) | Simple, portable; keychain adds complexity for v1                          |
| HTTP client        | `net/http` + `go-retryablehttp`     | Minimal deps, automatic retry with backoff                                 |
| Output             | lipgloss tables + fatih/color       | Modern, styled terminal output                                             |
| Prompts            | `charmbracelet/huh`                 | Active, accessible, replaces archived `survey`                             |
| Binary name        | `pendek`                            | Short, matches the app name, easy to type                                  |

## Edge Cases Handled

| Scenario                                    | Behavior                                                                            |
| ------------------------------------------- | ----------------------------------------------------------------------------------- |
| Not logged in, runs authenticated command   | Error: "Not logged in. Run `pendek login` first."                                   |
| Access token expired, refresh token valid   | Auto-refresh transparently, retry request                                           |
| Both tokens expired                         | Error: "Session expired. Run `pendek login` to re-authenticate."                    |
| Already logged in, runs `login`             | Warn: "Already logged in as X. Logout first?" (yes/no prompt)                       |
| Network failure                             | Error: "Cannot connect to API. Check your network and API URL." (after 3 retries)   |
| API returns 429                             | Error: "Rate limited. Please wait and try again."                                   |
| Empty link list                             | Friendly: "No links yet. Create one with: pendek shorten <url>"                     |
| Invalid URL (no scheme)                     | Error: "Invalid URL. Must start with http:// or https://"                           |
| Custom code conflict (409)                  | Error: "Short code 'mylink' already taken. Try a different code."                   |
| Clipboard unavailable (Linux without xclip) | Warning: "Clipboard unavailable. Install xclip to use --copy." (still outputs link) |
| Piping output to file                       | Auto-detect non-TTY, disable colors, use plain text tables                          |

## Acceptance Criteria

- [ ] `pendek login` authenticates and stores tokens securely
- [ ] `pendek shorten <url>` creates a link and outputs the short URL
- [ ] `pendek shorten <url> --copy` copies to clipboard
- [ ] `pendek list` shows links in a formatted table
- [ ] `pendek list --json` outputs machine-readable JSON
- [ ] `pendek stats` shows analytics summary
- [ ] `pendek delete <id>` deletes with confirmation
- [ ] `pendek delete <id> --yes` skips confirmation
- [ ] Auto token refresh works transparently
- [ ] All commands show user-friendly errors (not raw API/HTTP errors)
- [ ] Cross-platform build works (linux/darwin/windows, amd64/arm64)
- [ ] `pendek version` shows version, commit, build date
- [ ] Config file created at `~/.config/pendek-in/` with proper permissions

## References

### Internal

- Backend API routes: `apps/backend/main.go:182-218`
- Auth handler (login/refresh): `apps/backend/internal/routes/auth_routes.go:47-156`
- Link handler (CRUD): `apps/backend/internal/routes/link_routes.go`
- Analytics handler: `apps/backend/internal/routes/analytic_routes.go`
- API response types: `apps/backend/internal/models/responses/`
- Request DTOs: `apps/backend/internal/models/requests/`
- JWT helper (token structure): `apps/backend/internal/utils/jwt_helper.go`
- Swagger spec: `apps/backend/docs/swagger.yaml`
- Landing page terminal demo: `apps/web/app/page.tsx:346-387`
- Root Makefile: `Makefile`
- Backend Makefile: `apps/backend/Makefile`

### External

- Cobra docs: https://github.com/spf13/cobra
- Viper docs: https://github.com/spf13/viper
- GoReleaser: https://goreleaser.com
- lipgloss table: https://pkg.go.dev/github.com/charmbracelet/lipgloss/table
- charmbracelet/huh: https://github.com/charmbracelet/huh
- go-retryablehttp: https://github.com/hashicorp/go-retryablehttp
- XDG Base Directory Spec: https://xdgbasedirectoryspecification.com/
- GitHub CLI (reference implementation): https://github.com/cli/cli
