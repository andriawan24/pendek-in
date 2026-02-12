package responses

import (
	"testing"
	"time"

	"github.com/andriawan24/link-short/internal/database"
	"github.com/stretchr/testify/assert"
)

func TestMapAnalyticsResponse(t *testing.T) {
	t.Run("maps rows correctly", func(t *testing.T) {
		now := time.Now()
		rows := []database.GetByDateRangeRow{
			{Date: now, TotalClick: 10},
			{Date: now.Add(24 * time.Hour), TotalClick: 20},
		}

		result := MapAnalyticsResponse(rows)

		assert.Len(t, result, 2)
		assert.Equal(t, 10, result[0].Value)
		assert.Equal(t, 20, result[1].Value)
		assert.Equal(t, now, result[0].Date)
	})

	t.Run("returns nil for empty slice", func(t *testing.T) {
		result := MapAnalyticsResponse(nil)
		assert.Nil(t, result)
	})
}

func TestMapDeviceBreakdown(t *testing.T) {
	t.Run("maps rows correctly", func(t *testing.T) {
		rows := []database.GetDeviceBreakdownRow{
			{DeviceType: "mobile", Total: 50},
			{DeviceType: "desktop", Total: 30},
		}

		result := MapDeviceBreakdown(rows)

		assert.Len(t, result, 2)
		assert.Equal(t, "mobile", result[0].Type)
		assert.Equal(t, int64(50), result[0].Value)
		assert.Equal(t, "desktop", result[1].Type)
		assert.Equal(t, int64(30), result[1].Value)
	})

	t.Run("returns nil for empty slice", func(t *testing.T) {
		result := MapDeviceBreakdown(nil)
		assert.Nil(t, result)
	})
}

func TestMapDeviceBreakdownSingle(t *testing.T) {
	rows := []database.GetDeviceBreakdownSingleRow{
		{DeviceType: "tablet", Total: 15},
	}

	result := MapDeviceBreakdownSingle(rows)

	assert.Len(t, result, 1)
	assert.Equal(t, "tablet", result[0].Type)
	assert.Equal(t, int64(15), result[0].Value)
}

func TestMapTopCountries(t *testing.T) {
	rows := []database.GetTopCountriesRow{
		{Country: "US", Total: 100},
		{Country: "ID", Total: 50},
	}

	result := MapTopCountries(rows)

	assert.Len(t, result, 2)
	assert.Equal(t, "US", result[0].Type)
	assert.Equal(t, int64(100), result[0].Value)
}

func TestMapTopCountriesSingle(t *testing.T) {
	rows := []database.GetTopCountriesSingleRow{
		{Country: "JP", Total: 25},
	}

	result := MapTopCountriesSingle(rows)

	assert.Len(t, result, 1)
	assert.Equal(t, "JP", result[0].Type)
}

func TestMapTrafficSources(t *testing.T) {
	rows := []database.GetTrafficSourcesRow{
		{TrafficSource: "google.com", Total: 80},
		{TrafficSource: "direct", Total: 40},
	}

	result := MapTrafficSources(rows)

	assert.Len(t, result, 2)
	assert.Equal(t, "google.com", result[0].Type)
	assert.Equal(t, int64(80), result[0].Value)
}

func TestMapBrowserUsage(t *testing.T) {
	rows := []database.GetBrowserUsageRow{
		{Browser: "Chrome", Total: 60},
		{Browser: "Firefox", Total: 25},
	}

	result := MapBrowserUsage(rows)

	assert.Len(t, result, 2)
	assert.Equal(t, "Chrome", result[0].Type)
	assert.Equal(t, int64(60), result[0].Value)
}
