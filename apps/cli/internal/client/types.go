package client

import "time"

// BaseResponse is the API envelope for successful responses.
type BaseResponse[T any] struct {
	Message string `json:"message"`
	Data    T      `json:"data,omitempty"`
}

// ErrorResponse is the API envelope for error responses.
type ErrorResponse struct {
	Message string `json:"message"`
	Error   any    `json:"error,omitempty"`
}

// LoginRequest matches the backend LoginParam.
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginResponse matches the backend LoginResponse.
type LoginResponse struct {
	Token                 string       `json:"token"`
	TokenExpiredAt        time.Time    `json:"token_expired_at"`
	RefreshToken          string       `json:"refresh_token"`
	RefreshTokenExpiredAt time.Time    `json:"refresh_token_expired_at"`
	User                  UserResponse `json:"user"`
}

// UserResponse matches the backend UserResponse.
type UserResponse struct {
	ID              string `json:"id"`
	Name            string `json:"name"`
	Email           string `json:"email"`
	IsActive        bool   `json:"is_active"`
	IsVerified      bool   `json:"is_verified"`
	ProfileImageUrl string `json:"profile_image_url"`
}

// CreateLinkRequest matches the backend InsertLinkParam.
type CreateLinkRequest struct {
	OriginalURL     string     `json:"original_url"`
	CustomShortCode *string    `json:"custom_short_code,omitempty"`
	ExpiredAt       *time.Time `json:"expired_at,omitempty"`
}

// LinkResponse matches the backend LinkResponse.
type LinkResponse struct {
	ID               string      `json:"id"`
	OriginalURL      string      `json:"original_url"`
	ShortCode        string      `json:"short_code"`
	CustomShortCode  *string     `json:"custom_short_code"`
	ClickCount       int64       `json:"click_count"`
	ExpiredAt        *time.Time  `json:"expired_at"`
	CreatedAt        time.Time   `json:"created_at"`
	DeviceBreakdowns []TypeValue `json:"device_breakdowns"`
	TopCountries     []TypeValue `json:"top_countries"`
}

// TypeValue is a generic type-value pair used in analytics.
type TypeValue struct {
	Type  string `json:"type"`
	Value int64  `json:"value"`
}

// AnalyticsResponse matches the backend AnalyticsResponse.
type AnalyticsResponse struct {
	TimeRange        string             `json:"time_range"`
	FromDate         time.Time          `json:"from_date"`
	ToDate           time.Time          `json:"to_date"`
	TotalClicks      int64              `json:"total_clicks"`
	TotalActiveLinks int64              `json:"total_active_links"`
	TopLink          *TopLink           `json:"top_link"`
	AvgDailyClick    int64              `json:"avg_daily_click"`
	Overviews        []AnalyticOverview `json:"overviews"`
	DeviceBreakdowns []TypeValue        `json:"device_breakdowns"`
	TopCountries     []TypeValue        `json:"top_countries"`
	TrafficSources   []TypeValue        `json:"traffic_sources"`
	BrowserUsages    []TypeValue        `json:"browser_usages"`
}

// DashboardResponse matches the backend DashboardResponse.
type DashboardResponse struct {
	TotalClicks      int64              `json:"total_clicks"`
	TotalActiveLinks int64              `json:"total_active_links"`
	TopLink          *TopLink           `json:"top_link"`
	Overviews        []AnalyticOverview `json:"overviews"`
	Recents          []LinkResponse     `json:"recents"`
}

// TopLink wraps a link with its total click count.
type TopLink struct {
	Link        LinkResponse `json:"link"`
	TotalClicks int64        `json:"total_clicks"`
}

// AnalyticOverview is a date-value pair for chart data.
type AnalyticOverview struct {
	Date  time.Time `json:"date"`
	Value int       `json:"value"`
}

// RefreshRequest is the body for token refresh.
type RefreshRequest struct {
	RefreshToken string `json:"refresh_token"`
}
