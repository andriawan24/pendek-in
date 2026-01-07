# LinksApi

All URIs are relative to _http://localhost:8080_

| Method                                             | HTTP request           | Description     |
| -------------------------------------------------- | ---------------------- | --------------- |
| [**linksAllGet**](LinksApi.md#linksallget)         | **GET** /links/all     | Get all links   |
| [**linksCreatePost**](LinksApi.md#linkscreatepost) | **POST** /links/create | Create new link |
| [**linksIdGet**](LinksApi.md#linksidget)           | **GET** /links/{id}    | Get link by ID  |

## linksAllGet

> LinksAllGet200Response linksAllGet(page, limit, orderBy)

Get all links

Get all links for the authenticated user with pagination

### Example

```ts
import { Configuration, LinksApi } from '';
import type { LinksAllGetRequest } from '';

async function example() {
  console.log('🚀 Testing  SDK...');
  const config = new Configuration({
    // To configure API key authorization: BearerAuth
    apiKey: 'YOUR API KEY',
  });
  const api = new LinksApi(config);

  const body = {
    // number | Page number (optional)
    page: 56,
    // number | Items per page (optional)
    limit: 56,
    // 'created_at' | 'counts' | Order by field (optional)
    orderBy: orderBy_example,
  } satisfies LinksAllGetRequest;

  try {
    const data = await api.linksAllGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name        | Type                   | Description    | Notes                                                           |
| ----------- | ---------------------- | -------------- | --------------------------------------------------------------- |
| **page**    | `number`               | Page number    | [Optional] [Defaults to `1`]                                    |
| **limit**   | `number`               | Items per page | [Optional] [Defaults to `10`]                                   |
| **orderBy** | `created_at`, `counts` | Order by field | [Optional] [Defaults to `undefined`] [Enum: created_at, counts] |

### Return type

[**LinksAllGet200Response**](LinksAllGet200Response.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description           | Response headers |
| ----------- | --------------------- | ---------------- |
| **200**     | OK                    | -                |
| **400**     | Bad Request           | -                |
| **401**     | Unauthorized          | -                |
| **500**     | Internal Server Error | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## linksCreatePost

> LinksIdGet200Response linksCreatePost(request)

Create new link

Create a new shortened link

### Example

```ts
import {
  Configuration,
  LinksApi,
} from '';
import type { LinksCreatePostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // To configure API key authorization: BearerAuth
    apiKey: "YOUR API KEY",
  });
  const api = new LinksApi(config);

  const body = {
    // RequestsInsertLinkParam | Link details
    request: ...,
  } satisfies LinksCreatePostRequest;

  try {
    const data = await api.linksCreatePost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name        | Type                                                  | Description  | Notes |
| ----------- | ----------------------------------------------------- | ------------ | ----- |
| **request** | [RequestsInsertLinkParam](RequestsInsertLinkParam.md) | Link details |       |

### Return type

[**LinksIdGet200Response**](LinksIdGet200Response.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description           | Response headers |
| ----------- | --------------------- | ---------------- |
| **200**     | OK                    | -                |
| **400**     | Bad Request           | -                |
| **401**     | Unauthorized          | -                |
| **500**     | Internal Server Error | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## linksIdGet

> LinksIdGet200Response linksIdGet(id)

Get link by ID

Get a specific link by its ID

### Example

```ts
import { Configuration, LinksApi } from '';
import type { LinksIdGetRequest } from '';

async function example() {
  console.log('🚀 Testing  SDK...');
  const config = new Configuration({
    // To configure API key authorization: BearerAuth
    apiKey: 'YOUR API KEY',
  });
  const api = new LinksApi(config);

  const body = {
    // string | Link ID
    id: id_example,
  } satisfies LinksIdGetRequest;

  try {
    const data = await api.linksIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name   | Type     | Description | Notes                     |
| ------ | -------- | ----------- | ------------------------- |
| **id** | `string` | Link ID     | [Defaults to `undefined`] |

### Return type

[**LinksIdGet200Response**](LinksIdGet200Response.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description           | Response headers |
| ----------- | --------------------- | ---------------- |
| **200**     | OK                    | -                |
| **400**     | Bad Request           | -                |
| **401**     | Unauthorized          | -                |
| **404**     | Not Found             | -                |
| **500**     | Internal Server Error | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
