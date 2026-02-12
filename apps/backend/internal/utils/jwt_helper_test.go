package utils

import (
	"database/sql"
	"testing"
	"time"

	"github.com/andriawan24/link-short/internal/database"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func newTestUser() database.User {
	return database.User{
		ID:    uuid.New(),
		Name:  "Test User",
		Email: "test@example.com",
		PasswordHash: sql.NullString{
			String: "$2a$10$hashedpassword",
			Valid:  true,
		},
		IsActive:   true,
		IsVerified: true,
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}
}

func TestGenerateAndParseAccessToken(t *testing.T) {
	t.Setenv("TOKEN_SECRET", "test-access-secret-key-at-least-32-chars!")
	t.Setenv("REFRESH_TOKEN_SECRET", "test-refresh-secret-key-at-least-32-chars!")

	user := newTestUser()

	t.Run("generates valid access token", func(t *testing.T) {
		token, claims, err := GenerateAccessToken(user)
		require.NoError(t, err)
		assert.NotEmpty(t, token)
		assert.Equal(t, user.ID, claims.UserId)
		assert.Equal(t, accessTokenType, claims.TokenType)
		assert.Equal(t, defaultIssuer, claims.Issuer)
		assert.Equal(t, user.Name, claims.Subject)
		assert.WithinDuration(t, time.Now().Add(defaultAccessTokenTTL), claims.ExpiresAt.Time, 5*time.Second)
	})

	t.Run("parses valid access token", func(t *testing.T) {
		token, _, err := GenerateAccessToken(user)
		require.NoError(t, err)

		parsed, err := ParseToken(token)
		require.NoError(t, err)
		assert.Equal(t, user.ID, parsed.UserId)
		assert.Equal(t, accessTokenType, parsed.TokenType)
	})

	t.Run("GenerateJwtToken delegates to GenerateAccessToken", func(t *testing.T) {
		token, claims, err := GenerateJwtToken(user)
		require.NoError(t, err)
		assert.NotEmpty(t, token)
		assert.Equal(t, accessTokenType, claims.TokenType)
	})
}

func TestGenerateAndParseRefreshToken(t *testing.T) {
	t.Setenv("TOKEN_SECRET", "test-access-secret-key-at-least-32-chars!")
	t.Setenv("REFRESH_TOKEN_SECRET", "test-refresh-secret-key-at-least-32-chars!")

	user := newTestUser()

	t.Run("generates valid refresh token", func(t *testing.T) {
		token, claims, err := GenerateRefreshToken(user)
		require.NoError(t, err)
		assert.NotEmpty(t, token)
		assert.Equal(t, user.ID, claims.UserId)
		assert.Equal(t, refreshTokenType, claims.TokenType)
		assert.WithinDuration(t, time.Now().Add(defaultRefreshTokenTTL), claims.ExpiresAt.Time, 5*time.Second)
	})

	t.Run("parses valid refresh token", func(t *testing.T) {
		token, _, err := GenerateRefreshToken(user)
		require.NoError(t, err)

		parsed, err := ParseRefreshToken(token)
		require.NoError(t, err)
		assert.Equal(t, user.ID, parsed.UserId)
		assert.Equal(t, refreshTokenType, parsed.TokenType)
	})
}

func TestParseToken_InvalidCases(t *testing.T) {
	t.Setenv("TOKEN_SECRET", "test-access-secret-key-at-least-32-chars!")
	t.Setenv("REFRESH_TOKEN_SECRET", "test-refresh-secret-key-at-least-32-chars!")

	user := newTestUser()

	t.Run("rejects empty token", func(t *testing.T) {
		_, err := ParseToken("")
		assert.Error(t, err)
	})

	t.Run("rejects garbage token", func(t *testing.T) {
		_, err := ParseToken("not.a.valid.token")
		assert.Error(t, err)
	})

	t.Run("rejects refresh token when parsing access token", func(t *testing.T) {
		refreshToken, _, err := GenerateRefreshToken(user)
		require.NoError(t, err)

		_, err = ParseToken(refreshToken)
		assert.Error(t, err)
	})

	t.Run("rejects access token when parsing refresh token", func(t *testing.T) {
		accessToken, _, err := GenerateAccessToken(user)
		require.NoError(t, err)

		_, err = ParseRefreshToken(accessToken)
		assert.Error(t, err)
	})
}

func TestTokenSecretFromEnv_Missing(t *testing.T) {
	// Do not set TOKEN_SECRET env var
	t.Setenv("TOKEN_SECRET", "")

	user := newTestUser()
	_, _, err := GenerateAccessToken(user)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "TOKEN_SECRET")
}

func TestRefreshTokenSecret_Missing(t *testing.T) {
	t.Setenv("REFRESH_TOKEN_SECRET", "")

	user := newTestUser()
	_, _, err := GenerateRefreshToken(user)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "REFRESH_TOKEN_SECRET")
}

func TestParseToken_MissingSecret(t *testing.T) {
	t.Setenv("TOKEN_SECRET", "")

	_, err := ParseToken("some.token.here")
	assert.Error(t, err)
}

func TestParseRefreshToken_MissingSecret(t *testing.T) {
	t.Setenv("REFRESH_TOKEN_SECRET", "")

	_, err := ParseRefreshToken("some.token.here")
	assert.Error(t, err)
}
