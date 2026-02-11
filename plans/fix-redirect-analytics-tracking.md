# fix: Send analytics data from frontend redirect to backend

## Overview

Fix the URL shortener redirect flow to capture accurate user analytics. Currently, the frontend (`apps/web/app/[code]/page.tsx`) redirects users without sending any analytics data to the backend, resulting in missing or inaccurate click tracking data.

## Problem Statement

```
Current Flow (Broken Analytics):
User → Next.js Server → Go Backend (gets Next.js IP, not user's)
                     ↓
              redirect(url) → User reaches destination
              ❌ No analytics sent with real user data
```

**Impact:**

- All click logs show the same IP (Next.js server)
- Geolocation analytics show server location, not user location
- Device/browser analytics are incorrect

## Proposed Solution

Modify the existing `Redirect` function to accept POST with JSON body containing user analytics data. Return JSON with redirect URL.

```
Proposed Flow:
User → Next.js Server
         ↓
    1. Extract headers (IP, UA, referer)
    2. POST /{code} with analytics in body
    3. Backend logs analytics, returns JSON
    4. Next.js performs redirect(url)
```

## Implementation

### Backend: `apps/backend/main.go`

```diff
- r.GET("/:code", linkRoutes.Redirect)
+ r.POST("/:code", linkRoutes.Redirect)
```

### Backend: `apps/backend/internal/routes/link_routes.go`

```go
type RedirectRequest struct {
	IP        string `json:"ip"`
	UserAgent string `json:"userAgent"`
	Referer   string `json:"referer"`
}

func (r *linkRoutes) Redirect(ctx *gin.Context) {
	code := ctx.Param("code")
	reqCtx := ctx.Request.Context()

	var req RedirectRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	parser := useragent.NewParser()
	ua := parser.Parse(req.UserAgent)

	param := database.InsertClickLogParams{
		Code:       code,
		IpAddress:  sql.NullString{Valid: req.IP != "", String: req.IP},
		UserAgent:  sql.NullString{Valid: req.UserAgent != "", String: req.UserAgent},
		Referrer:   sql.NullString{Valid: req.Referer != "", String: req.Referer},
		DeviceType: sql.NullString{Valid: true, String: utils.ParseDeviceType(ua)},
		Country:    sql.NullString{Valid: true, String: utils.ParseCountryFromIp(req.IP)},
		Traffic:    sql.NullString{Valid: true, String: utils.ParseTrafficSource(req.Referer)},
		Browser:    sql.NullString{Valid: true, String: utils.ParseBrowser(ua)},
	}

	// Try redis cache
	originalURL, err := r.cacheService.GetURL(reqCtx, code)
	if err == nil && originalURL != "" {
		r.clickLogService.InsertClickLog(reqCtx, param)
		ctx.JSON(http.StatusOK, gin.H{"redirect_url": originalURL})
		return
	}

	// Get from database
	originalURL, err = r.linkService.GetRedirectedLink(reqCtx, code)
	if err != nil {
		utils.HandleErrorResponse(ctx, err)
		return
	}

	go r.cacheService.SetURL(context.Background(), code, originalURL, 24*time.Hour)
	r.clickLogService.InsertClickLog(reqCtx, param)

	ctx.JSON(http.StatusOK, gin.H{"redirect_url": originalURL})
}
```

### Frontend: `apps/web/app/[code]/page.tsx`

```typescript
import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { isReservedRoute } from "@/lib/config";

interface RedirectPageProps {
  params: Promise<{ code: string }>;
}

export default async function RedirectPage({ params }: RedirectPageProps) {
  const { code } = await params;

  if (isReservedRoute(code)) {
    notFound();
  }

  const headersList = await headers();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}/${code}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ip: headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "",
        userAgent: headersList.get("user-agent") || "",
        referer: headersList.get("referer") || "",
      }),
    },
  );

  if (!response.ok) {
    notFound();
  }

  const { redirect_url } = await response.json();
  redirect(redirect_url);
}
```

## Files to Modify

| File                                                  | Change                           |
| ----------------------------------------------------- | -------------------------------- |
| `apps/backend/main.go:205`                            | `GET` → `POST`                   |
| `apps/backend/internal/routes/link_routes.go:247-316` | Read JSON body, return JSON      |
| `apps/web/app/[code]/page.tsx`                        | Extract headers, POST to backend |

## Acceptance Criteria

- [ ] `POST /:code` returns JSON with `redirect_url`
- [ ] Analytics logged with real user IP
- [ ] Analytics logged with real user User-Agent
- [ ] Analytics logged with real referrer
- [ ] Device type, country, browser, traffic parsed correctly

## References

- Backend redirect: `apps/backend/internal/routes/link_routes.go:247-316`
- Route registration: `apps/backend/main.go:205`
- Frontend page: `apps/web/app/[code]/page.tsx`
