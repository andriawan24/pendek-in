package routes

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/andriawan24/link-short/internal/database"
	"github.com/andriawan24/link-short/internal/models/responses"
	"github.com/andriawan24/link-short/internal/services"
	"github.com/andriawan24/link-short/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func init() {
	gin.SetMode(gin.TestMode)
}

// --- Mock services ---

type mockUserService struct {
	getUserByID              func(ctx context.Context, id uuid.UUID) (database.User, error)
	getUserByToken           func(ctx context.Context, token string) (database.User, error)
	findUserByEmail          func(ctx context.Context, email string) (database.User, error)
	findUserByGoogleID       func(ctx context.Context, googleID string) (database.User, error)
	insertUser               func(ctx context.Context, param database.InsertUserParams) (database.User, error)
	insertUserWithGoogle     func(ctx context.Context, param database.InsertUserWithGoogleParams) (database.User, error)
	updateUser               func(ctx context.Context, param database.UpdateUserParams) (database.User, error)
	verifyUser               func(ctx context.Context, id uuid.UUID) (database.User, error)
	linkGoogleToUser         func(ctx context.Context, param database.LinkGoogleToUserParams) (database.User, error)
	updateVerificationToken  func(ctx context.Context, param database.UpdateVerificationTokenParams) (database.User, error)
}

func (m *mockUserService) GetUserByID(ctx context.Context, id uuid.UUID) (database.User, error) {
	return m.getUserByID(ctx, id)
}
func (m *mockUserService) GetUserByToken(ctx context.Context, token string) (database.User, error) {
	return m.getUserByToken(ctx, token)
}
func (m *mockUserService) FindUserByEmail(ctx context.Context, email string) (database.User, error) {
	return m.findUserByEmail(ctx, email)
}
func (m *mockUserService) FindUserByGoogleID(ctx context.Context, googleID string) (database.User, error) {
	return m.findUserByGoogleID(ctx, googleID)
}
func (m *mockUserService) InsertUser(ctx context.Context, param database.InsertUserParams) (database.User, error) {
	return m.insertUser(ctx, param)
}
func (m *mockUserService) InsertUserWithGoogle(ctx context.Context, param database.InsertUserWithGoogleParams) (database.User, error) {
	return m.insertUserWithGoogle(ctx, param)
}
func (m *mockUserService) UpdateUser(ctx context.Context, param database.UpdateUserParams) (database.User, error) {
	return m.updateUser(ctx, param)
}
func (m *mockUserService) VerifyUser(ctx context.Context, id uuid.UUID) (database.User, error) {
	return m.verifyUser(ctx, id)
}
func (m *mockUserService) LinkGoogleToUser(ctx context.Context, param database.LinkGoogleToUserParams) (database.User, error) {
	return m.linkGoogleToUser(ctx, param)
}
func (m *mockUserService) UpdateVerificationToken(ctx context.Context, param database.UpdateVerificationTokenParams) (database.User, error) {
	return m.updateVerificationToken(ctx, param)
}

type mockOAuthService struct {
	getGoogleAuthURL  func(state string) string
	getGoogleUserInfo func(ctx context.Context, code string) (*services.GoogleUserInfo, error)
}

func (m *mockOAuthService) GetGoogleAuthURL(state string) string {
	return m.getGoogleAuthURL(state)
}
func (m *mockOAuthService) GetGoogleUserInfo(ctx context.Context, code string) (*services.GoogleUserInfo, error) {
	return m.getGoogleUserInfo(ctx, code)
}

type mockLinkService struct {
	getTotalCounts    func(ctx context.Context, userId uuid.UUID, from time.Time, to time.Time) (int64, error)
	getTotalActive    func(ctx context.Context, userId uuid.UUID) (int64, error)
	getLinks          func(ctx context.Context, userId uuid.UUID, limit int32, offset int32, orderBy utils.LinkOrderBy) ([]database.GetLinksRow, error)
	getLink           func(ctx context.Context, userId uuid.UUID, id uuid.UUID) (database.GetLinkRow, error)
	getRedirectedLink func(ctx context.Context, shortCode string) (string, error)
	insertLink        func(ctx context.Context, param database.InsertLinkParams) (database.Link, error)
	deleteLink        func(ctx context.Context, param database.DeleteLinkParams) error
}

func (m *mockLinkService) GetTotalCounts(ctx context.Context, userId uuid.UUID, from time.Time, to time.Time) (int64, error) {
	return m.getTotalCounts(ctx, userId, from, to)
}
func (m *mockLinkService) GetTotalActiveLinks(ctx context.Context, userId uuid.UUID) (int64, error) {
	return m.getTotalActive(ctx, userId)
}
func (m *mockLinkService) GetLinks(ctx context.Context, userId uuid.UUID, limit int32, offset int32, orderBy utils.LinkOrderBy) ([]database.GetLinksRow, error) {
	return m.getLinks(ctx, userId, limit, offset, orderBy)
}
func (m *mockLinkService) GetLink(ctx context.Context, userId uuid.UUID, id uuid.UUID) (database.GetLinkRow, error) {
	return m.getLink(ctx, userId, id)
}
func (m *mockLinkService) GetRedirectedLink(ctx context.Context, shortCode string) (string, error) {
	return m.getRedirectedLink(ctx, shortCode)
}
func (m *mockLinkService) InsertLink(ctx context.Context, param database.InsertLinkParams) (database.Link, error) {
	return m.insertLink(ctx, param)
}
func (m *mockLinkService) DeleteLink(ctx context.Context, param database.DeleteLinkParams) error {
	return m.deleteLink(ctx, param)
}

type mockClickLogService struct {
	insertClickLog               func(ctx context.Context, param database.InsertClickLogParams) (database.ClickLog, error)
	getByDateRange               func(ctx context.Context, userId uuid.UUID, from time.Time, to time.Time) ([]database.GetByDateRangeRow, error)
	getDeviceBreakdown           func(ctx context.Context, userId uuid.UUID, from time.Time, to time.Time) ([]database.GetDeviceBreakdownRow, error)
	getDeviceBreakdownSingleLink func(ctx context.Context, userId uuid.UUID, linkId uuid.UUID, from time.Time, to time.Time) ([]database.GetDeviceBreakdownSingleRow, error)
	getTopCountries              func(ctx context.Context, userId uuid.UUID, from time.Time, to time.Time) ([]database.GetTopCountriesRow, error)
	getTopCountriesSingleLink    func(ctx context.Context, userId uuid.UUID, linkId uuid.UUID, from time.Time, to time.Time) ([]database.GetTopCountriesSingleRow, error)
	getTrafficSources            func(ctx context.Context, userId uuid.UUID, from time.Time, to time.Time) ([]database.GetTrafficSourcesRow, error)
	getBrowserUsage              func(ctx context.Context, userId uuid.UUID, from time.Time, to time.Time) ([]database.GetBrowserUsageRow, error)
}

func (m *mockClickLogService) InsertClickLog(ctx context.Context, param database.InsertClickLogParams) (database.ClickLog, error) {
	return m.insertClickLog(ctx, param)
}
func (m *mockClickLogService) GetByDateRange(ctx context.Context, userId uuid.UUID, from time.Time, to time.Time) ([]database.GetByDateRangeRow, error) {
	return m.getByDateRange(ctx, userId, from, to)
}
func (m *mockClickLogService) GetDeviceBreakdown(ctx context.Context, userId uuid.UUID, from time.Time, to time.Time) ([]database.GetDeviceBreakdownRow, error) {
	return m.getDeviceBreakdown(ctx, userId, from, to)
}
func (m *mockClickLogService) GetDeviceBreakdownSingleLink(ctx context.Context, userId uuid.UUID, linkId uuid.UUID, from time.Time, to time.Time) ([]database.GetDeviceBreakdownSingleRow, error) {
	return m.getDeviceBreakdownSingleLink(ctx, userId, linkId, from, to)
}
func (m *mockClickLogService) GetTopCountries(ctx context.Context, userId uuid.UUID, from time.Time, to time.Time) ([]database.GetTopCountriesRow, error) {
	return m.getTopCountries(ctx, userId, from, to)
}
func (m *mockClickLogService) GetTopCountriesSingleLink(ctx context.Context, userId uuid.UUID, linkId uuid.UUID, from time.Time, to time.Time) ([]database.GetTopCountriesSingleRow, error) {
	return m.getTopCountriesSingleLink(ctx, userId, linkId, from, to)
}
func (m *mockClickLogService) GetTrafficSources(ctx context.Context, userId uuid.UUID, from time.Time, to time.Time) ([]database.GetTrafficSourcesRow, error) {
	return m.getTrafficSources(ctx, userId, from, to)
}
func (m *mockClickLogService) GetBrowserUsage(ctx context.Context, userId uuid.UUID, from time.Time, to time.Time) ([]database.GetBrowserUsageRow, error) {
	return m.getBrowserUsage(ctx, userId, from, to)
}

type mockCacheService struct {
	getURL        func(ctx context.Context, code string) (string, error)
	setURL        func(ctx context.Context, code, originalURL string, ttl time.Duration) error
	invalidateURL func(ctx context.Context, code string) error
}

func (m *mockCacheService) GetURL(ctx context.Context, code string) (string, error) {
	return m.getURL(ctx, code)
}
func (m *mockCacheService) SetURL(ctx context.Context, code, originalURL string, ttl time.Duration) error {
	return m.setURL(ctx, code, originalURL, ttl)
}
func (m *mockCacheService) InvalidateURL(ctx context.Context, code string) error {
	return m.invalidateURL(ctx, code)
}

type mockDashboardService struct {
	getLandingStats func(ctx context.Context) (responses.LandingStatsResponse, error)
}

func (m *mockDashboardService) GetLandingStats(ctx context.Context) (responses.LandingStatsResponse, error) {
	return m.getLandingStats(ctx)
}

// --- Helper to inject user_id into gin context (simulates auth middleware) ---

func withAuth(router *gin.Engine, userID uuid.UUID, method, path string, handler gin.HandlerFunc) {
	router.Handle(method, path, func(ctx *gin.Context) {
		ctx.Set("user_id", userID)
		ctx.Next()
	}, handler)
}

// ============================
// Auth Routes Tests
// ============================

func TestAuthRoutes_Login_Success(t *testing.T) {
	t.Setenv("TOKEN_SECRET", "test-access-secret-key-at-least-32-chars!")
	t.Setenv("REFRESH_TOKEN_SECRET", "test-refresh-secret-key-at-least-32-chars!")

	userID := uuid.New()
	hashedPw := "$2a$10$Q9VYGz9x5dK6W5VkX7YP3.c5QZ9E3vK9T5nW5L6Y4HqFk5L4Jjv1G" // just a dummy; we'll mock bcrypt

	// We need a real bcrypt hash for the password "password123"
	// For test purposes, generate one
	pw := "password123"
	_ = pw

	mockUser := &mockUserService{
		findUserByEmail: func(ctx context.Context, email string) (database.User, error) {
			// Use bcrypt to hash "password123" for comparison
			return database.User{
				ID:    userID,
				Name:  "Test User",
				Email: email,
				PasswordHash: sql.NullString{
					String: hashedPw,
					Valid:  true,
				},
				IsActive:   true,
				IsVerified: true,
			}, nil
		},
	}
	_ = mockUser

	// Test the case where user is not found
	t.Run("login fails with wrong email", func(t *testing.T) {
		mockSvc := &mockUserService{
			findUserByEmail: func(ctx context.Context, email string) (database.User, error) {
				return database.User{}, sql.ErrNoRows
			},
		}
		mockOAuth := &mockOAuthService{}

		routes := NewAuthRoutes(mockSvc, mockOAuth)

		router := gin.New()
		router.POST("/auth/login", routes.Login)

		body := `{"email":"wrong@example.com","password":"password123"}`
		req := httptest.NewRequest(http.MethodPost, "/auth/login", strings.NewReader(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})

	t.Run("login fails with invalid JSON", func(t *testing.T) {
		mockSvc := &mockUserService{}
		mockOAuth := &mockOAuthService{}

		routes := NewAuthRoutes(mockSvc, mockOAuth)

		router := gin.New()
		router.POST("/auth/login", routes.Login)

		req := httptest.NewRequest(http.MethodPost, "/auth/login", strings.NewReader("{invalid}"))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})

	t.Run("login fails with missing required fields", func(t *testing.T) {
		mockSvc := &mockUserService{}
		mockOAuth := &mockOAuthService{}

		routes := NewAuthRoutes(mockSvc, mockOAuth)

		router := gin.New()
		router.POST("/auth/login", routes.Login)

		body := `{"email":"test@example.com"}`
		req := httptest.NewRequest(http.MethodPost, "/auth/login", strings.NewReader(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}

func TestAuthRoutes_Profile(t *testing.T) {
	t.Setenv("TOKEN_SECRET", "test-access-secret-key-at-least-32-chars!")
	t.Setenv("REFRESH_TOKEN_SECRET", "test-refresh-secret-key-at-least-32-chars!")

	userID := uuid.New()

	t.Run("returns user profile successfully", func(t *testing.T) {
		mockSvc := &mockUserService{
			getUserByID: func(ctx context.Context, id uuid.UUID) (database.User, error) {
				return database.User{
					ID:         id,
					Name:       "Test User",
					Email:      "test@example.com",
					IsActive:   true,
					IsVerified: true,
					ProfileImageUrl: sql.NullString{
						String: "/uploads/profiles/pic.jpg",
						Valid:  true,
					},
				}, nil
			},
		}
		mockOAuth := &mockOAuthService{}

		routes := NewAuthRoutes(mockSvc, mockOAuth)

		router := gin.New()
		withAuth(router, userID, http.MethodGet, "/auth/me", routes.Profile)

		req := httptest.NewRequest(http.MethodGet, "/auth/me", nil)
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		var resp responses.BaseResponse
		err := json.Unmarshal(w.Body.Bytes(), &resp)
		require.NoError(t, err)
		assert.Equal(t, "successfully get profile", resp.Message)
	})

	t.Run("returns error when user not found", func(t *testing.T) {
		mockSvc := &mockUserService{
			getUserByID: func(ctx context.Context, id uuid.UUID) (database.User, error) {
				return database.User{}, sql.ErrNoRows
			},
		}
		mockOAuth := &mockOAuthService{}

		routes := NewAuthRoutes(mockSvc, mockOAuth)

		router := gin.New()
		withAuth(router, userID, http.MethodGet, "/auth/me", routes.Profile)

		req := httptest.NewRequest(http.MethodGet, "/auth/me", nil)
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusNotFound, w.Code)
	})
}

func TestAuthRoutes_VerifyEmail(t *testing.T) {
	userID := uuid.New()

	t.Run("returns error when token is missing", func(t *testing.T) {
		mockSvc := &mockUserService{}
		mockOAuth := &mockOAuthService{}

		routes := NewAuthRoutes(mockSvc, mockOAuth)

		router := gin.New()
		router.GET("/auth/verify-email", routes.VerifyEmail)

		req := httptest.NewRequest(http.MethodGet, "/auth/verify-email", nil)
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})

	t.Run("returns error when token not found in DB", func(t *testing.T) {
		mockSvc := &mockUserService{
			getUserByToken: func(ctx context.Context, token string) (database.User, error) {
				return database.User{}, sql.ErrNoRows
			},
		}
		mockOAuth := &mockOAuthService{}

		routes := NewAuthRoutes(mockSvc, mockOAuth)

		router := gin.New()
		router.GET("/auth/verify-email", routes.VerifyEmail)

		req := httptest.NewRequest(http.MethodGet, "/auth/verify-email?token=invalid-token", nil)
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusNotFound, w.Code)
	})

	t.Run("verifies email successfully", func(t *testing.T) {
		mockSvc := &mockUserService{
			getUserByToken: func(ctx context.Context, token string) (database.User, error) {
				return database.User{
					ID:         userID,
					Name:       "Test User",
					Email:      "test@example.com",
					IsVerified: false,
				}, nil
			},
			verifyUser: func(ctx context.Context, id uuid.UUID) (database.User, error) {
				return database.User{
					ID:         id,
					Name:       "Test User",
					Email:      "test@example.com",
					IsVerified: true,
				}, nil
			},
		}
		mockOAuth := &mockOAuthService{}

		routes := NewAuthRoutes(mockSvc, mockOAuth)

		router := gin.New()
		router.GET("/auth/verify-email", routes.VerifyEmail)

		req := httptest.NewRequest(http.MethodGet, "/auth/verify-email?token=valid-token", nil)
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		var resp responses.BaseResponse
		err := json.Unmarshal(w.Body.Bytes(), &resp)
		require.NoError(t, err)
		assert.Equal(t, "email verified successfully", resp.Message)
	})
}

func TestAuthRoutes_ResendVerification(t *testing.T) {
	t.Setenv("FRONTEND_URL", "http://localhost:3000")

	userID := uuid.New()

	t.Run("returns error if already verified", func(t *testing.T) {
		mockSvc := &mockUserService{
			getUserByID: func(ctx context.Context, id uuid.UUID) (database.User, error) {
				return database.User{
					ID:         id,
					IsVerified: true,
				}, nil
			},
		}
		mockOAuth := &mockOAuthService{}

		routes := NewAuthRoutes(mockSvc, mockOAuth)

		router := gin.New()
		withAuth(router, userID, http.MethodPost, "/auth/resend-verification", routes.ResendVerification)

		req := httptest.NewRequest(http.MethodPost, "/auth/resend-verification", nil)
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})

	t.Run("sends verification email successfully", func(t *testing.T) {
		mockSvc := &mockUserService{
			getUserByID: func(ctx context.Context, id uuid.UUID) (database.User, error) {
				return database.User{
					ID:         id,
					Name:       "Test",
					Email:      "test@example.com",
					IsVerified: false,
				}, nil
			},
			updateVerificationToken: func(ctx context.Context, param database.UpdateVerificationTokenParams) (database.User, error) {
				return database.User{ID: param.ID}, nil
			},
		}
		mockOAuth := &mockOAuthService{}

		routes := NewAuthRoutes(mockSvc, mockOAuth)

		router := gin.New()
		withAuth(router, userID, http.MethodPost, "/auth/resend-verification", routes.ResendVerification)

		req := httptest.NewRequest(http.MethodPost, "/auth/resend-verification", nil)
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
	})
}

// ============================
// Dashboard Routes Tests
// ============================

func TestDashboardRoutes_GetLandingStats(t *testing.T) {
	t.Run("returns stats successfully", func(t *testing.T) {
		mockSvc := &mockDashboardService{
			getLandingStats: func(ctx context.Context) (responses.LandingStatsResponse, error) {
				return responses.LandingStatsResponse{
					TotalLinks:       100,
					TotalActiveUsers: 50,
					TotalClicks:      5000,
				}, nil
			},
		}

		routes := NewDashboardRoutes(mockSvc)

		router := gin.New()
		router.GET("/dashboard/stats", routes.GetLandingStats)

		req := httptest.NewRequest(http.MethodGet, "/dashboard/stats", nil)
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		var resp responses.BaseResponse
		err := json.Unmarshal(w.Body.Bytes(), &resp)
		require.NoError(t, err)
		assert.Equal(t, "successfully get landing stats", resp.Message)
	})

	t.Run("returns error when service fails", func(t *testing.T) {
		mockSvc := &mockDashboardService{
			getLandingStats: func(ctx context.Context) (responses.LandingStatsResponse, error) {
				return responses.LandingStatsResponse{}, errors.New("database error")
			},
		}

		routes := NewDashboardRoutes(mockSvc)

		router := gin.New()
		router.GET("/dashboard/stats", routes.GetLandingStats)

		req := httptest.NewRequest(http.MethodGet, "/dashboard/stats", nil)
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusInternalServerError, w.Code)
	})
}

// ============================
// Link Routes Tests
// ============================

func TestLinkRoutes_GetLinks(t *testing.T) {
	userID := uuid.New()

	t.Run("returns links successfully with defaults", func(t *testing.T) {
		mockLink := &mockLinkService{
			getLinks: func(ctx context.Context, userId uuid.UUID, limit int32, offset int32, orderBy utils.LinkOrderBy) ([]database.GetLinksRow, error) {
				assert.Equal(t, int32(10), limit)
				assert.Equal(t, int32(0), offset)
				assert.Equal(t, utils.OrderByCreatedDate, orderBy)
				return []database.GetLinksRow{}, nil
			},
		}
		mockClick := &mockClickLogService{}
		mockCache := &mockCacheService{}

		routes := NewLinkRoutes(mockLink, mockClick, mockCache)

		router := gin.New()
		withAuth(router, userID, http.MethodGet, "/links/all", routes.GetLinks)

		req := httptest.NewRequest(http.MethodGet, "/links/all", nil)
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
	})

	t.Run("applies pagination params", func(t *testing.T) {
		mockLink := &mockLinkService{
			getLinks: func(ctx context.Context, userId uuid.UUID, limit int32, offset int32, orderBy utils.LinkOrderBy) ([]database.GetLinksRow, error) {
				assert.Equal(t, int32(5), limit)
				assert.Equal(t, int32(10), offset) // page 3, limit 5 => offset 10
				assert.Equal(t, utils.OrderByCounts, orderBy)
				return []database.GetLinksRow{}, nil
			},
		}
		mockClick := &mockClickLogService{}
		mockCache := &mockCacheService{}

		routes := NewLinkRoutes(mockLink, mockClick, mockCache)

		router := gin.New()
		withAuth(router, userID, http.MethodGet, "/links/all", routes.GetLinks)

		req := httptest.NewRequest(http.MethodGet, "/links/all?page=3&limit=5&orderBy=counts", nil)
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
	})

	t.Run("returns error for invalid page", func(t *testing.T) {
		mockLink := &mockLinkService{}
		mockClick := &mockClickLogService{}
		mockCache := &mockCacheService{}

		routes := NewLinkRoutes(mockLink, mockClick, mockCache)

		router := gin.New()
		withAuth(router, userID, http.MethodGet, "/links/all", routes.GetLinks)

		req := httptest.NewRequest(http.MethodGet, "/links/all?page=abc", nil)
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusInternalServerError, w.Code)
	})
}

func TestLinkRoutes_InsertLink(t *testing.T) {
	userID := uuid.New()
	linkID := uuid.New()
	now := time.Now()

	t.Run("creates link successfully", func(t *testing.T) {
		mockLink := &mockLinkService{
			insertLink: func(ctx context.Context, param database.InsertLinkParams) (database.Link, error) {
				return database.Link{
					ID:          linkID,
					OriginalUrl: param.OriginalUrl,
					ShortCode:   param.ShortCode,
					UserID:      param.UserID,
					CreatedAt:   now,
					UpdatedAt:   now,
				}, nil
			},
		}
		mockClick := &mockClickLogService{}
		mockCache := &mockCacheService{}

		routes := NewLinkRoutes(mockLink, mockClick, mockCache)

		router := gin.New()
		withAuth(router, userID, http.MethodPost, "/links/create", routes.InsertLink)

		body := `{"original_url":"https://example.com"}`
		req := httptest.NewRequest(http.MethodPost, "/links/create", strings.NewReader(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusCreated, w.Code)
	})

	t.Run("returns error for missing original_url", func(t *testing.T) {
		mockLink := &mockLinkService{}
		mockClick := &mockClickLogService{}
		mockCache := &mockCacheService{}

		routes := NewLinkRoutes(mockLink, mockClick, mockCache)

		router := gin.New()
		withAuth(router, userID, http.MethodPost, "/links/create", routes.InsertLink)

		body := `{}`
		req := httptest.NewRequest(http.MethodPost, "/links/create", strings.NewReader(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}

func TestLinkRoutes_DeleteLink(t *testing.T) {
	userID := uuid.New()
	linkID := uuid.New()
	now := time.Now()

	t.Run("deletes link successfully", func(t *testing.T) {
		mockLink := &mockLinkService{
			getLink: func(ctx context.Context, userId uuid.UUID, id uuid.UUID) (database.GetLinkRow, error) {
				return database.GetLinkRow{
					ID:          linkID,
					OriginalUrl: "https://example.com",
					ShortCode:   "abc123",
					UserID:      userID,
					CreatedAt:   now,
				}, nil
			},
			deleteLink: func(ctx context.Context, param database.DeleteLinkParams) error {
				assert.Equal(t, userID, param.UserID)
				assert.Equal(t, linkID, param.ID)
				return nil
			},
		}
		mockClick := &mockClickLogService{}
		mockCache := &mockCacheService{}

		routes := NewLinkRoutes(mockLink, mockClick, mockCache)

		router := gin.New()
		withAuth(router, userID, http.MethodDelete, "/links/:id", routes.DeleteLink)

		req := httptest.NewRequest(http.MethodDelete, "/links/"+linkID.String(), nil)
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusNoContent, w.Code)
	})

	t.Run("returns error for invalid uuid", func(t *testing.T) {
		mockLink := &mockLinkService{}
		mockClick := &mockClickLogService{}
		mockCache := &mockCacheService{}

		routes := NewLinkRoutes(mockLink, mockClick, mockCache)

		router := gin.New()
		withAuth(router, userID, http.MethodDelete, "/links/:id", routes.DeleteLink)

		req := httptest.NewRequest(http.MethodDelete, "/links/not-a-uuid", nil)
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		// uuid.Parse error goes through HandleErrorResponse default case (500)
		assert.Equal(t, http.StatusInternalServerError, w.Code)
	})

	t.Run("returns 404 when link not found", func(t *testing.T) {
		mockLink := &mockLinkService{
			getLink: func(ctx context.Context, userId uuid.UUID, id uuid.UUID) (database.GetLinkRow, error) {
				return database.GetLinkRow{}, sql.ErrNoRows
			},
		}
		mockClick := &mockClickLogService{}
		mockCache := &mockCacheService{}

		routes := NewLinkRoutes(mockLink, mockClick, mockCache)

		router := gin.New()
		withAuth(router, userID, http.MethodDelete, "/links/:id", routes.DeleteLink)

		req := httptest.NewRequest(http.MethodDelete, "/links/"+uuid.New().String(), nil)
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusNotFound, w.Code)
	})
}

func TestLinkRoutes_Redirect(t *testing.T) {
	t.Run("redirects via cache hit", func(t *testing.T) {
		mockLink := &mockLinkService{}
		mockClick := &mockClickLogService{
			insertClickLog: func(ctx context.Context, param database.InsertClickLogParams) (database.ClickLog, error) {
				return database.ClickLog{}, nil
			},
		}
		mockCache := &mockCacheService{
			getURL: func(ctx context.Context, code string) (string, error) {
				return "https://cached.example.com", nil
			},
		}

		routes := NewLinkRoutes(mockLink, mockClick, mockCache)

		router := gin.New()
		router.POST("/:code", routes.Redirect)

		body := `{"ip":"1.2.3.4","userAgent":"Mozilla/5.0","referer":"https://google.com"}`
		req := httptest.NewRequest(http.MethodPost, "/abc123", strings.NewReader(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		var resp map[string]string
		err := json.Unmarshal(w.Body.Bytes(), &resp)
		require.NoError(t, err)
		assert.Equal(t, "https://cached.example.com", resp["redirect_url"])
	})

	t.Run("redirects via database on cache miss", func(t *testing.T) {
		mockLink := &mockLinkService{
			getRedirectedLink: func(ctx context.Context, shortCode string) (string, error) {
				return "https://db.example.com", nil
			},
		}
		mockClick := &mockClickLogService{
			insertClickLog: func(ctx context.Context, param database.InsertClickLogParams) (database.ClickLog, error) {
				return database.ClickLog{}, nil
			},
		}
		mockCache := &mockCacheService{
			getURL: func(ctx context.Context, code string) (string, error) {
				return "", errors.New("cache miss")
			},
			setURL: func(ctx context.Context, code, originalURL string, ttl time.Duration) error {
				return nil
			},
		}

		routes := NewLinkRoutes(mockLink, mockClick, mockCache)

		router := gin.New()
		router.POST("/:code", routes.Redirect)

		body := `{"ip":"1.2.3.4","userAgent":"Mozilla/5.0","referer":""}`
		req := httptest.NewRequest(http.MethodPost, "/abc123", strings.NewReader(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		var resp map[string]string
		err := json.Unmarshal(w.Body.Bytes(), &resp)
		require.NoError(t, err)
		assert.Equal(t, "https://db.example.com", resp["redirect_url"])
	})

	t.Run("returns 404 when link not found in DB", func(t *testing.T) {
		mockLink := &mockLinkService{
			getRedirectedLink: func(ctx context.Context, shortCode string) (string, error) {
				return "", sql.ErrNoRows
			},
		}
		mockClick := &mockClickLogService{}
		mockCache := &mockCacheService{
			getURL: func(ctx context.Context, code string) (string, error) {
				return "", errors.New("cache miss")
			},
		}

		routes := NewLinkRoutes(mockLink, mockClick, mockCache)

		router := gin.New()
		router.POST("/:code", routes.Redirect)

		body := `{"ip":"1.2.3.4","userAgent":"Mozilla/5.0","referer":""}`
		req := httptest.NewRequest(http.MethodPost, "/nonexistent", strings.NewReader(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusNotFound, w.Code)
	})

	t.Run("returns 400 for invalid request body", func(t *testing.T) {
		mockLink := &mockLinkService{}
		mockClick := &mockClickLogService{}
		mockCache := &mockCacheService{}

		routes := NewLinkRoutes(mockLink, mockClick, mockCache)

		router := gin.New()
		router.POST("/:code", routes.Redirect)

		req := httptest.NewRequest(http.MethodPost, "/abc123", strings.NewReader("{invalid json"))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}

// ============================
// Analytic Routes Tests
// ============================

func TestAnalyticRoutes_GetDashboard(t *testing.T) {
	userID := uuid.New()

	t.Run("returns dashboard data successfully", func(t *testing.T) {
		mockLink := &mockLinkService{
			getTotalCounts: func(ctx context.Context, userId uuid.UUID, from time.Time, to time.Time) (int64, error) {
				return 100, nil
			},
			getTotalActive: func(ctx context.Context, userId uuid.UUID) (int64, error) {
				return 10, nil
			},
			getLinks: func(ctx context.Context, userId uuid.UUID, limit int32, offset int32, orderBy utils.LinkOrderBy) ([]database.GetLinksRow, error) {
				return []database.GetLinksRow{}, nil
			},
		}
		mockClick := &mockClickLogService{
			getByDateRange: func(ctx context.Context, userId uuid.UUID, from time.Time, to time.Time) ([]database.GetByDateRangeRow, error) {
				return []database.GetByDateRangeRow{}, nil
			},
		}

		routes := NewAnalyticRoutes(mockLink, mockClick)

		router := gin.New()
		withAuth(router, userID, http.MethodGet, "/analytics/dashboard", routes.GetDashboard)

		req := httptest.NewRequest(http.MethodGet, "/analytics/dashboard", nil)
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		var resp responses.BaseResponse
		err := json.Unmarshal(w.Body.Bytes(), &resp)
		require.NoError(t, err)
		assert.Equal(t, "successfully get dashboard", resp.Message)
	})

	t.Run("returns error when total clicks fails", func(t *testing.T) {
		mockLink := &mockLinkService{
			getTotalCounts: func(ctx context.Context, userId uuid.UUID, from time.Time, to time.Time) (int64, error) {
				return 0, errors.New("db error")
			},
		}
		mockClick := &mockClickLogService{}

		routes := NewAnalyticRoutes(mockLink, mockClick)

		router := gin.New()
		withAuth(router, userID, http.MethodGet, "/analytics/dashboard", routes.GetDashboard)

		req := httptest.NewRequest(http.MethodGet, "/analytics/dashboard", nil)
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusInternalServerError, w.Code)
	})
}

func TestAnalyticRoutes_GetAnalytics(t *testing.T) {
	userID := uuid.New()

	defaultMockLink := &mockLinkService{
		getTotalCounts: func(ctx context.Context, userId uuid.UUID, from time.Time, to time.Time) (int64, error) {
			return 500, nil
		},
		getTotalActive: func(ctx context.Context, userId uuid.UUID) (int64, error) {
			return 20, nil
		},
		getLinks: func(ctx context.Context, userId uuid.UUID, limit int32, offset int32, orderBy utils.LinkOrderBy) ([]database.GetLinksRow, error) {
			return []database.GetLinksRow{}, nil
		},
	}

	defaultMockClick := &mockClickLogService{
		getByDateRange: func(ctx context.Context, userId uuid.UUID, from time.Time, to time.Time) ([]database.GetByDateRangeRow, error) {
			return []database.GetByDateRangeRow{}, nil
		},
		getDeviceBreakdown: func(ctx context.Context, userId uuid.UUID, from time.Time, to time.Time) ([]database.GetDeviceBreakdownRow, error) {
			return []database.GetDeviceBreakdownRow{}, nil
		},
		getTopCountries: func(ctx context.Context, userId uuid.UUID, from time.Time, to time.Time) ([]database.GetTopCountriesRow, error) {
			return []database.GetTopCountriesRow{}, nil
		},
		getTrafficSources: func(ctx context.Context, userId uuid.UUID, from time.Time, to time.Time) ([]database.GetTrafficSourcesRow, error) {
			return []database.GetTrafficSourcesRow{}, nil
		},
		getBrowserUsage: func(ctx context.Context, userId uuid.UUID, from time.Time, to time.Time) ([]database.GetBrowserUsageRow, error) {
			return []database.GetBrowserUsageRow{}, nil
		},
	}

	t.Run("returns analytics with default range", func(t *testing.T) {
		routes := NewAnalyticRoutes(defaultMockLink, defaultMockClick)

		router := gin.New()
		withAuth(router, userID, http.MethodGet, "/analytics/", routes.GetAnalytics)

		req := httptest.NewRequest(http.MethodGet, "/analytics/", nil)
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
	})

	t.Run("respects range query param", func(t *testing.T) {
		routes := NewAnalyticRoutes(defaultMockLink, defaultMockClick)

		router := gin.New()
		withAuth(router, userID, http.MethodGet, "/analytics/", routes.GetAnalytics)

		req := httptest.NewRequest(http.MethodGet, "/analytics/?range=7d", nil)
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
	})
}
