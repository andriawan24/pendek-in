# DashboardApi

All URIs are relative to _http://localhost:8080_

| Method                                                     | HTTP request             | Description                 |
| ---------------------------------------------------------- | ------------------------ | --------------------------- |
| [**dashboardStatsGet**](DashboardApi.md#dashboardstatsget) | **GET** /dashboard/stats | Get landing page statistics |

## dashboardStatsGet

> DashboardStatsGet200Response dashboardStatsGet()

Get landing page statistics

Get total links created, active users, and total clicks

### Example

```ts
import { Configuration, DashboardApi } from '';
import type { DashboardStatsGetRequest } from '';

async function example() {
  console.log('🚀 Testing  SDK...');
  const api = new DashboardApi();

  try {
    const data = await api.dashboardStatsGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**DashboardStatsGet200Response**](DashboardStatsGet200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description           | Response headers |
| ----------- | --------------------- | ---------------- |
| **200**     | OK                    | -                |
| **500**     | Internal Server Error | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
