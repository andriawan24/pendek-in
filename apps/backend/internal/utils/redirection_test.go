package utils

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestParseTrafficSource(t *testing.T) {
	tests := []struct {
		name     string
		referrer string
		expected string
	}{
		{"empty referrer returns direct", "", "direct"},
		{"invalid URL returns unknown", "not-a-url://[invalid", "unknown"},
		{"facebook.com", "https://www.facebook.com/some-page", "facebook.com"},
		{"twitter.com", "https://twitter.com/user/status/123", "twitter.com"},
		{"x.com", "https://x.com/user/status/123", "x.com"},
		{"instagram.com", "https://www.instagram.com/p/abc", "instagram.com"},
		{"linkedin.com", "https://www.linkedin.com/feed", "linkedin.com"},
		{"pinterest.com", "https://pinterest.com/pin/123", "pinterest.com"},
		{"reddit.com", "https://www.reddit.com/r/golang", "reddit.com"},
		{"tiktok.com", "https://www.tiktok.com/@user", "tiktok.com"},
		{"youtube.com", "https://www.youtube.com/watch?v=abc", "youtube.com"},
		{"google.com search", "https://www.google.com/search?q=test", "google.com"},
		{"bing.com search", "https://www.bing.com/search?q=test", "bing.com"},
		{"yahoo.com search", "https://search.yahoo.com/search?p=test", "yahoo.com"},
		{"duckduckgo.com", "https://duckduckgo.com/?q=test", "duckduckgo.com"},
		{"custom domain", "https://myblog.example.com/article", "myblog.example.com"},
		{"strips www prefix", "https://www.example.com/page", "example.com"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.expected, ParseTrafficSource(tt.referrer))
		})
	}
}

func TestParseCountryFromIp(t *testing.T) {
	tests := []struct {
		name     string
		ip       string
		expected string
	}{
		{"empty IP returns unknown", "", "unknown"},
		{"invalid IP returns unknown", "not-an-ip", "unknown"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := ParseCountryFromIp(tt.ip)
			assert.NotEmpty(t, result)
			if tt.expected == "unknown" {
				assert.Equal(t, "unknown", result)
			}
		})
	}
}
