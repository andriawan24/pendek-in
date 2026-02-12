package utils

import (
	"encoding/hex"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestGetOrElse(t *testing.T) {
	t.Run("returns value when pointer is non-nil", func(t *testing.T) {
		val := "hello"
		result := GetOrElse(&val, "default")
		assert.Equal(t, "hello", result)
	})

	t.Run("returns default when pointer is nil", func(t *testing.T) {
		result := GetOrElse[string](nil, "default")
		assert.Equal(t, "default", result)
	})

	t.Run("works with int type", func(t *testing.T) {
		val := 42
		assert.Equal(t, 42, GetOrElse(&val, 0))
		assert.Equal(t, 0, GetOrElse[int](nil, 0))
	})

	t.Run("works with bool type", func(t *testing.T) {
		val := true
		assert.Equal(t, true, GetOrElse(&val, false))
		assert.Equal(t, false, GetOrElse[bool](nil, false))
	})
}

func TestGenerateVerificationEmailToken(t *testing.T) {
	t.Run("returns valid hex token", func(t *testing.T) {
		token, err := GenerateVerificationEmailToken()
		require.NoError(t, err)
		assert.NotEmpty(t, token)

		// Token should be 64 hex characters (32 bytes encoded)
		assert.Len(t, token, 64)

		// Should be valid hex
		decoded, err := hex.DecodeString(token)
		require.NoError(t, err)
		assert.Len(t, decoded, 32)
	})

	t.Run("generates unique tokens", func(t *testing.T) {
		token1, err := GenerateVerificationEmailToken()
		require.NoError(t, err)

		token2, err := GenerateVerificationEmailToken()
		require.NoError(t, err)

		assert.NotEqual(t, token1, token2)
	})
}
