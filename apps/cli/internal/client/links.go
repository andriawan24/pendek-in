package client

import (
	"fmt"
	"net/http"
)

// CreateLink creates a new shortened URL.
func (c *Client) CreateLink(req CreateLinkRequest) (*LinkResponse, error) {
	var resp BaseResponse[LinkResponse]
	err := c.doAuthRequest(http.MethodPost, "/links/create", req, &resp)
	if err != nil {
		return nil, err
	}
	return &resp.Data, nil
}

// ListLinks returns all links for the authenticated user.
func (c *Client) ListLinks() ([]LinkResponse, error) {
	var resp BaseResponse[[]LinkResponse]
	err := c.doAuthRequest(http.MethodGet, "/links/all", nil, &resp)
	if err != nil {
		return nil, err
	}
	return resp.Data, nil
}

// GetLink returns a single link by ID.
func (c *Client) GetLink(id string) (*LinkResponse, error) {
	var resp BaseResponse[LinkResponse]
	err := c.doAuthRequest(http.MethodGet, fmt.Sprintf("/links/%s", id), nil, &resp)
	if err != nil {
		return nil, err
	}
	return &resp.Data, nil
}

// DeleteLink deletes a link by ID.
func (c *Client) DeleteLink(id string) error {
	return c.doAuthRequest(http.MethodDelete, fmt.Sprintf("/links/%s", id), nil, nil)
}
