# RedirectApi

All URIs are relative to _http://localhost:8080_

| Method                                | HTTP request    | Description              |
| ------------------------------------- | --------------- | ------------------------ |
| [**codeGet**](RedirectApi.md#codeget) | **GET** /{code} | Redirect to original URL |

## codeGet

> codeGet(code)

Redirect to original URL

Redirect to the original URL using the short code

### Example

```ts
import { Configuration, RedirectApi } from '';
import type { CodeGetRequest } from '';

async function example() {
  console.log('🚀 Testing  SDK...');
  const api = new RedirectApi();

  const body = {
    // string | Short code
    code: code_example,
  } satisfies CodeGetRequest;

  try {
    const data = await api.codeGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name     | Type     | Description | Notes                     |
| -------- | -------- | ----------- | ------------------------- |
| **code** | `string` | Short code  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`

### HTTP response details

| Status code | Description              | Response headers |
| ----------- | ------------------------ | ---------------- |
| **301**     | Redirect to original URL | -                |
| **404**     | Not Found                | -                |
| **500**     | Internal Server Error    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
