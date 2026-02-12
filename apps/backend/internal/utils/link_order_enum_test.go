package utils

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestLinkOrderBy_GetString(t *testing.T) {
	tests := []struct {
		name     string
		orderBy  LinkOrderBy
		expected string
	}{
		{"created date", OrderByCreatedDate, "created_at"},
		{"updated date", OrderByUpdatedDate, "updated_at"},
		{"expired date", OrderByExpiredDate, "expired_at"},
		{"counts", OrderByCounts, "counts"},
		{"unknown defaults to created_at", LinkOrderBy(99), "created_at"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.expected, tt.orderBy.GetString())
		})
	}
}

func TestParseLinkOrderBy(t *testing.T) {
	tests := []struct {
		name        string
		input       string
		expected    LinkOrderBy
		expectError bool
	}{
		{"parses created_at", "created_at", OrderByCreatedDate, false},
		{"parses updated_at", "updated_at", OrderByUpdatedDate, false},
		{"parses expired_at", "expired_at", OrderByExpiredDate, false},
		{"parses counts", "counts", OrderByCounts, false},
		{"returns error for unknown", "invalid", OrderByCreatedDate, true},
		{"returns error for empty", "", OrderByCreatedDate, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := ParseLinkOrderBy(tt.input)
			assert.Equal(t, tt.expected, result)
			if tt.expectError {
				require.Error(t, err)
				var invalidErr *InvalidOrderByError
				assert.ErrorAs(t, err, &invalidErr)
				assert.Equal(t, tt.input, invalidErr.Value)
			} else {
				require.NoError(t, err)
			}
		})
	}
}

func TestParseLinkOrderByOrDefault(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected LinkOrderBy
	}{
		{"parses valid value", "counts", OrderByCounts},
		{"defaults for invalid", "invalid", OrderByCreatedDate},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.expected, ParseLinkOrderByOrDefault(tt.input))
		})
	}
}

func TestInvalidOrderByError_Error(t *testing.T) {
	err := &InvalidOrderByError{Value: "bad_value"}
	assert.Contains(t, err.Error(), "bad_value")
	assert.Contains(t, err.Error(), "invalid order by value")
}
