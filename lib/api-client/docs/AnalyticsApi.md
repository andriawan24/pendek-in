# AnalyticsApi

All URIs are relative to _http://localhost:8080_

| Method                                                             | HTTP request                 | Description        |
| ------------------------------------------------------------------ | ---------------------------- | ------------------ |
| [**analyticsDashboardGet**](AnalyticsApi.md#analyticsdashboardget) | **GET** /analytics/dashboard | Get dashboard data |
| [**analyticsGet**](AnalyticsApi.md#analyticsget)                   | **GET** /analytics/          | Get analytics data |

## analyticsDashboardGet

> AnalyticsDashboardGet200Response analyticsDashboardGet()

Get dashboard data

Get dashboard overview including total clicks, active links, top link, and recent links

### Example

```ts
import { Configuration, AnalyticsApi } from '';
import type { AnalyticsDashboardGetRequest } from '';

async function example() {
  console.log('🚀 Testing  SDK...');
  const config = new Configuration({
    // To configure API key authorization: BearerAuth
    apiKey: 'YOUR API KEY',
  });
  const api = new AnalyticsApi(config);

  try {
    const data = await api.analyticsDashboardGet();
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

[**AnalyticsDashboardGet200Response**](AnalyticsDashboardGet200Response.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description           | Response headers |
| ----------- | --------------------- | ---------------- |
| **200**     | OK                    | -                |
| **401**     | Unauthorized          | -                |
| **500**     | Internal Server Error | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## analyticsGet

> AnalyticsGet200Response analyticsGet(range)

Get analytics data

Get detailed analytics including device breakdowns, countries, traffic sources, and browser usage

### Example

```ts
import { Configuration, AnalyticsApi } from '';
import type { AnalyticsGetRequest } from '';

async function example() {
  console.log('🚀 Testing  SDK...');
  const config = new Configuration({
    // To configure API key authorization: BearerAuth
    apiKey: 'YOUR API KEY',
  });
  const api = new AnalyticsApi(config);

  const body = {
    // '7d' | '30d' | '90d' | 'all' | Time range (optional)
    range: range_example,
  } satisfies AnalyticsGetRequest;

  try {
    const data = await api.analyticsGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name      | Type                      | Description | Notes                                                              |
| --------- | ------------------------- | ----------- | ------------------------------------------------------------------ |
| **range** | `7d`, `30d`, `90d`, `all` | Time range  | [Optional] [Defaults to `&#39;30d&#39;`] [Enum: 7d, 30d, 90d, all] |

### Return type

[**AnalyticsGet200Response**](AnalyticsGet200Response.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description           | Response headers |
| ----------- | --------------------- | ---------------- |
| **200**     | OK                    | -                |
| **401**     | Unauthorized          | -                |
| **500**     | Internal Server Error | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
