package utils

import (
	"crypto/rand"
	"encoding/hex"
)

func GetOrElse[T any](arg *T, defaultValue T) T {
	if arg != nil {
		return *arg
	} else {
		return defaultValue
	}
}

func GenerateVerificationEmailToken() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}

	return hex.EncodeToString(bytes), nil
}