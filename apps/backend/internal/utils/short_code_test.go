package utils

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGenerateShortCode(t *testing.T) {
	t.Run("returns string of expected length", func(t *testing.T) {
		code := GenerateShortCode()
		assert.Len(t, code, defaultShortCodeN)
	})

	t.Run("contains only valid characters", func(t *testing.T) {
		code := GenerateShortCode()
		for _, c := range code {
			assert.Contains(t, shortCodeAlphabet, string(c))
		}
	})

	t.Run("generates unique codes", func(t *testing.T) {
		seen := make(map[string]bool)
		for range 100 {
			code := GenerateShortCode()
			assert.False(t, seen[code], "duplicate code generated: %s", code)
			seen[code] = true
		}
	})
}

func TestFallbackShortCode(t *testing.T) {
	t.Run("returns empty string for zero length", func(t *testing.T) {
		assert.Empty(t, fallbackShortCode(0))
	})

	t.Run("returns empty string for negative length", func(t *testing.T) {
		assert.Empty(t, fallbackShortCode(-1))
	})

	t.Run("returns correct length", func(t *testing.T) {
		code := fallbackShortCode(8)
		assert.Len(t, code, 8)
	})

	t.Run("contains only valid characters", func(t *testing.T) {
		code := fallbackShortCode(16)
		for _, c := range code {
			assert.Contains(t, shortCodeAlphabet, string(c))
		}
	})
}
