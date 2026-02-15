package client

import "net/http"

func (c *Client) Login(email, password string) (*LoginResponse, error) {
	var resp BaseResponse[LoginResponse]
	err := c.doRequest(http.MethodPost, "/auth/login", LoginRequest{
		Email:    email,
		Password: password,
	}, &resp)
	if err != nil {
		return nil, err
	}
	return &resp.Data, nil
}

func (c *Client) GetProfile() (*UserResponse, error) {
	var resp BaseResponse[UserResponse]
	err := c.doAuthRequest(http.MethodGet, "/auth/me", nil, &resp)
	if err != nil {
		return nil, err
	}
	return &resp.Data, nil
}
