package config

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"
)

const credentialsFileName = "credentials.json"

type Credentials struct {
	AccessToken           string    `json:"access_token"`
	RefreshToken          string    `json:"refresh_token"`
	AccessTokenExpiresAt  time.Time `json:"access_token_expires_at"`
	RefreshTokenExpiresAt time.Time `json:"refresh_token_expires_at"`
}

func SaveCredentials(creds *Credentials) error {
	dir, err := ConfigDir()
	if err != nil {
		return err
	}
	if err := os.MkdirAll(dir, 0700); err != nil {
		return err
	}

	data, err := json.MarshalIndent(creds, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(filepath.Join(dir, credentialsFileName), data, 0600)
}

func LoadCredentials() (*Credentials, error) {
	dir, err := ConfigDir()
	if err != nil {
		return nil, err
	}

	data, err := os.ReadFile(filepath.Join(dir, credentialsFileName))
	if err != nil {
		return nil, fmt.Errorf("not logged in. Run 'pendek login' first")
	}

	var creds Credentials
	if err := json.Unmarshal(data, &creds); err != nil {
		return nil, fmt.Errorf("corrupted credentials file. Run 'pendek login' to re-authenticate")
	}

	return &creds, nil
}

func ClearCredentials() error {
	dir, err := ConfigDir()
	if err != nil {
		return err
	}
	err = os.Remove(filepath.Join(dir, credentialsFileName))
	if os.IsNotExist(err) {
		return nil
	}
	return err
}

func (c *Credentials) IsAccessTokenExpired() bool {
	return time.Now().After(c.AccessTokenExpiresAt.Add(-60 * time.Second))
}

func (c *Credentials) IsRefreshTokenExpired() bool {
	return time.Now().After(c.RefreshTokenExpiresAt)
}
