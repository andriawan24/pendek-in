package client

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/andriawan24/pendek-in-cli/internal/config"
)

// Client is the HTTP API client for the Pendek API.
type Client struct {
	baseURL    string
	httpClient *http.Client
}

// New creates a new API client using the configured API URL.
func New() *Client {
	return &Client{
		baseURL: config.APIURL(),
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// doRequest performs an HTTP request and decodes the JSON response.
func (c *Client) doRequest(method, path string, body any, result any) error {
	fmt.Println("Base URL", c.baseURL+path)
	var reqBody io.Reader
	if body != nil {
		data, err := json.Marshal(body)
		if err != nil {
			return fmt.Errorf("failed to marshal request: %w", err)
		}
		reqBody = bytes.NewReader(data)
	}

	req, err := http.NewRequest(method, c.baseURL+path, reqBody)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response: %w", err)
	}

	if resp.StatusCode >= 400 {
		var errResp ErrorResponse
		if json.Unmarshal(respBody, &errResp) == nil && errResp.Message != "" {
			return fmt.Errorf("%s", errResp.Message)
		}
		return fmt.Errorf("API error (HTTP %d)", resp.StatusCode)
	}

	if result != nil {
		if err := json.Unmarshal(respBody, result); err != nil {
			return fmt.Errorf("failed to decode response: %w", err)
		}
	}

	return nil
}

// doAuthRequest performs an authenticated HTTP request, refreshing the token if needed.
func (c *Client) doAuthRequest(method, path string, body any, result any) error {
	creds, err := config.LoadCredentials()
	if err != nil {
		return err
	}

	if creds.IsRefreshTokenExpired() {
		return fmt.Errorf("session expired. Run 'pendek login' to re-authenticate")
	}

	if creds.IsAccessTokenExpired() {
		if err := c.refreshToken(creds); err != nil {
			return fmt.Errorf("failed to refresh token: %w. Run 'pendek login' to re-authenticate", err)
		}
		creds, err = config.LoadCredentials()
		if err != nil {
			return err
		}
	}

	var reqBody io.Reader
	if body != nil {
		data, err := json.Marshal(body)
		if err != nil {
			return fmt.Errorf("failed to marshal request: %w", err)
		}
		reqBody = bytes.NewReader(data)
	}

	req, err := http.NewRequest(method, c.baseURL+path, reqBody)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Authorization", "Bearer "+creds.AccessToken)

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response: %w", err)
	}

	if resp.StatusCode == 401 {
		return fmt.Errorf("unauthorized. Run 'pendek login' to re-authenticate")
	}

	if resp.StatusCode >= 400 {
		var errResp ErrorResponse
		if json.Unmarshal(respBody, &errResp) == nil && errResp.Message != "" {
			return fmt.Errorf("%s", errResp.Message)
		}
		return fmt.Errorf("API error (HTTP %d)", resp.StatusCode)
	}

	if result != nil {
		if err := json.Unmarshal(respBody, result); err != nil {
			return fmt.Errorf("failed to decode response: %w", err)
		}
	}

	return nil
}

func (c *Client) refreshToken(creds *config.Credentials) error {
	var resp BaseResponse[LoginResponse]
	err := c.doRequest(http.MethodPost, "/auth/refresh", RefreshRequest{
		RefreshToken: creds.RefreshToken,
	}, &resp)
	if err != nil {
		return err
	}

	return config.SaveCredentials(&config.Credentials{
		AccessToken:           resp.Data.Token,
		RefreshToken:          resp.Data.RefreshToken,
		AccessTokenExpiresAt:  resp.Data.TokenExpiredAt,
		RefreshTokenExpiresAt: resp.Data.RefreshTokenExpiredAt,
	})
}
