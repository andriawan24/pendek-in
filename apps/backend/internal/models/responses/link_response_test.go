package responses

import (
	"database/sql"
	"testing"
	"time"

	"github.com/andriawan24/link-short/internal/database"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func TestMapLinkResponses(t *testing.T) {
	now := time.Now()
	linkID := uuid.New()
	userID := uuid.New()
	customCode := "custom"
	expiry := now.Add(24 * time.Hour)

	t.Run("maps links with optional fields set", func(t *testing.T) {
		rows := []database.GetLinksRow{
			{
				ID:              linkID,
				OriginalUrl:     "https://example.com",
				ShortCode:       "abc123",
				CustomShortCode: sql.NullString{Valid: true, String: customCode},
				UserID:          userID,
				ExpiredAt:       sql.NullTime{Valid: true, Time: expiry},
				CreatedAt:       now,
				Counts:          42,
			},
		}

		result := MapLinkResponses(rows)

		assert.Len(t, result, 1)
		assert.Equal(t, linkID, result[0].ID)
		assert.Equal(t, "https://example.com", result[0].OriginalURL)
		assert.Equal(t, "abc123", result[0].ShortCode)
		assert.NotNil(t, result[0].CustomShortCode)
		assert.Equal(t, customCode, *result[0].CustomShortCode)
		assert.NotNil(t, result[0].ExpiredAt)
		assert.Equal(t, expiry, *result[0].ExpiredAt)
		assert.Equal(t, int64(42), result[0].ClickCount)
		assert.Equal(t, now, result[0].CreatedAt)
	})

	t.Run("maps links with optional fields null", func(t *testing.T) {
		rows := []database.GetLinksRow{
			{
				ID:              linkID,
				OriginalUrl:     "https://example.com",
				ShortCode:       "abc123",
				CustomShortCode: sql.NullString{Valid: false},
				ExpiredAt:       sql.NullTime{Valid: false},
				CreatedAt:       now,
			},
		}

		result := MapLinkResponses(rows)

		assert.Len(t, result, 1)
		assert.Nil(t, result[0].CustomShortCode)
		assert.Nil(t, result[0].ExpiredAt)
	})

	t.Run("empty input returns empty slice", func(t *testing.T) {
		result := MapLinkResponses([]database.GetLinksRow{})
		assert.Len(t, result, 0)
	})
}

func TestMapLinkResponse(t *testing.T) {
	now := time.Now()
	linkID := uuid.New()
	userID := uuid.New()

	row := database.GetLinkRow{
		ID:              linkID,
		OriginalUrl:     "https://example.com",
		ShortCode:       "abc123",
		CustomShortCode: sql.NullString{Valid: true, String: "custom"},
		UserID:          userID,
		ExpiredAt:       sql.NullTime{Valid: true, Time: now.Add(24 * time.Hour)},
		CreatedAt:       now,
	}

	devices := []TypeValue{{Type: "mobile", Value: 10}}
	countries := []TypeValue{{Type: "US", Value: 20}}

	result := MapLinkResponse(row, 100, devices, countries)

	assert.Equal(t, linkID, result.ID)
	assert.Equal(t, int64(100), result.ClickCount)
	assert.Equal(t, devices, result.DeviceBreakdowns)
	assert.Equal(t, countries, result.TopCountries)
	assert.NotNil(t, result.CustomShortCode)
	assert.NotNil(t, result.ExpiredAt)
}

func TestMapLinkDetailResponse(t *testing.T) {
	now := time.Now()
	linkID := uuid.New()
	userID := uuid.New()

	t.Run("with all fields", func(t *testing.T) {
		link := database.Link{
			ID:              linkID,
			OriginalUrl:     "https://example.com",
			ShortCode:       "abc123",
			CustomShortCode: sql.NullString{Valid: true, String: "my-link"},
			UserID:          userID,
			ExpiredAt:       sql.NullTime{Valid: true, Time: now.Add(48 * time.Hour)},
			CreatedAt:       now,
		}

		result := MapLinkDetailResponse(link)

		assert.Equal(t, linkID, result.ID)
		assert.Equal(t, "https://example.com", result.OriginalURL)
		assert.Equal(t, "abc123", result.ShortCode)
		assert.NotNil(t, result.CustomShortCode)
		assert.Equal(t, "my-link", *result.CustomShortCode)
		assert.NotNil(t, result.ExpiredAt)
	})

	t.Run("with null optional fields", func(t *testing.T) {
		link := database.Link{
			ID:              linkID,
			OriginalUrl:     "https://example.com",
			ShortCode:       "abc123",
			CustomShortCode: sql.NullString{Valid: false},
			ExpiredAt:       sql.NullTime{Valid: false},
			CreatedAt:       now,
		}

		result := MapLinkDetailResponse(link)

		assert.Nil(t, result.CustomShortCode)
		assert.Nil(t, result.ExpiredAt)
	})
}
