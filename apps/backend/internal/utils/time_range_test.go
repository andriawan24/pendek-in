package utils

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestTimeRange_IsValid(t *testing.T) {
	tests := []struct {
		name     string
		tr       TimeRange
		expected bool
	}{
		{"7d is valid", TimeRange7Days, true},
		{"30d is valid", TimeRange30Days, true},
		{"90d is valid", TimeRange90Days, true},
		{"all is valid", TimeRangeAll, true},
		{"empty is invalid", TimeRange(""), false},
		{"unknown is invalid", TimeRange("1y"), false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.expected, tt.tr.IsValid())
		})
	}
}

func TestTimeRange_GetFromDate(t *testing.T) {
	now := time.Now()

	tests := []struct {
		name        string
		tr          TimeRange
		expectedAge time.Duration
		isZero      bool
	}{
		{"7d returns ~7 days ago", TimeRange7Days, 7 * 24 * time.Hour, false},
		{"30d returns ~30 days ago", TimeRange30Days, 30 * 24 * time.Hour, false},
		{"90d returns ~90 days ago", TimeRange90Days, 90 * 24 * time.Hour, false},
		{"all returns zero time", TimeRangeAll, 0, true},
		{"default returns ~30 days ago", TimeRange("unknown"), 30 * 24 * time.Hour, false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.tr.GetFromDate()
			if tt.isZero {
				assert.True(t, result.IsZero())
			} else {
				diff := now.Sub(result)
				assert.InDelta(t, tt.expectedAge.Seconds(), diff.Seconds(), 2)
			}
		})
	}
}

func TestParseTimeRange(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected TimeRange
	}{
		{"parses 7d", "7d", TimeRange7Days},
		{"parses 30d", "30d", TimeRange30Days},
		{"parses 90d", "90d", TimeRange90Days},
		{"parses all", "all", TimeRangeAll},
		{"defaults to 30d for unknown", "invalid", TimeRange30Days},
		{"defaults to 30d for empty", "", TimeRange30Days},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.expected, ParseTimeRange(tt.input))
		})
	}
}
