package client

import (
	"fmt"
	"net/http"
)

// GetDashboard returns the dashboard summary.
func (c *Client) GetDashboard() (*DashboardResponse, error) {
	var resp BaseResponse[DashboardResponse]
	err := c.doAuthRequest(http.MethodGet, "/analytics/dashboard", nil, &resp)
	if err != nil {
		return nil, err
	}
	return &resp.Data, nil
}

// GetAnalytics returns analytics data for the given time range.
func (c *Client) GetAnalytics(timeRange string) (*AnalyticsResponse, error) {
	path := "/analytics/"
	if timeRange != "" {
		path = fmt.Sprintf("/analytics/?time_range=%s", timeRange)
	}
	var resp BaseResponse[AnalyticsResponse]
	err := c.doAuthRequest(http.MethodGet, path, nil, &resp)
	if err != nil {
		return nil, err
	}
	return &resp.Data, nil
}
