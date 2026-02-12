package middlewares

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/andriawan24/link-short/internal/database"
	"github.com/andriawan24/link-short/internal/models/responses"
	"github.com/andriawan24/link-short/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func setupRouter() *gin.Engine {
	r := gin.New()
	r.Use(RequiredAuth())
	r.GET("/protected", func(ctx *gin.Context) {
		userId := ctx.MustGet("user_id").(uuid.UUID)
		ctx.JSON(http.StatusOK, gin.H{"user_id": userId.String()})
	})
	return r
}

func TestRequiredAuth_NoAuthHeader(t *testing.T) {
	router := setupRouter()

	req := httptest.NewRequest(http.MethodGet, "/protected", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)

	var resp responses.ErrorResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	require.NoError(t, err)
	assert.Equal(t, "Unauthorized", resp.Message)
}

func TestRequiredAuth_InvalidFormat_NoBearerPrefix(t *testing.T) {
	router := setupRouter()

	req := httptest.NewRequest(http.MethodGet, "/protected", nil)
	req.Header.Set("Authorization", "Token some-token")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestRequiredAuth_InvalidFormat_SinglePart(t *testing.T) {
	router := setupRouter()

	req := httptest.NewRequest(http.MethodGet, "/protected", nil)
	req.Header.Set("Authorization", "BearerTokenNoSpace")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestRequiredAuth_InvalidFormat_TooManyParts(t *testing.T) {
	router := setupRouter()

	req := httptest.NewRequest(http.MethodGet, "/protected", nil)
	req.Header.Set("Authorization", "Bearer token extra")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestRequiredAuth_InvalidToken(t *testing.T) {
	t.Setenv("TOKEN_SECRET", "test-secret-key-at-least-32-characters!")

	router := setupRouter()

	req := httptest.NewRequest(http.MethodGet, "/protected", nil)
	req.Header.Set("Authorization", "Bearer invalid.jwt.token")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestRequiredAuth_ValidToken(t *testing.T) {
	t.Setenv("TOKEN_SECRET", "test-secret-key-at-least-32-characters!")
	t.Setenv("REFRESH_TOKEN_SECRET", "test-refresh-secret-at-least-32-chars!")

	user := database.User{
		ID:    uuid.New(),
		Name:  "Test User",
		Email: "test@example.com",
	}

	token, _, err := utils.GenerateAccessToken(user)
	require.NoError(t, err)

	router := setupRouter()

	req := httptest.NewRequest(http.MethodGet, "/protected", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var body map[string]string
	err = json.Unmarshal(w.Body.Bytes(), &body)
	require.NoError(t, err)
	assert.Equal(t, user.ID.String(), body["user_id"])
}

func TestRequiredAuth_RefreshTokenRejected(t *testing.T) {
	t.Setenv("TOKEN_SECRET", "test-secret-key-at-least-32-characters!")
	t.Setenv("REFRESH_TOKEN_SECRET", "test-refresh-secret-at-least-32-chars!")

	user := database.User{
		ID:    uuid.New(),
		Name:  "Test User",
		Email: "test@example.com",
	}

	refreshToken, _, err := utils.GenerateRefreshToken(user)
	require.NoError(t, err)

	router := setupRouter()

	req := httptest.NewRequest(http.MethodGet, "/protected", nil)
	req.Header.Set("Authorization", "Bearer "+refreshToken)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}
