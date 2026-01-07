# AuthApi

All URIs are relative to _http://localhost:8080_

| Method                                                      | HTTP request                 | Description         |
| ----------------------------------------------------------- | ---------------------------- | ------------------- |
| [**authLoginPost**](AuthApi.md#authloginpost)               | **POST** /auth/login         | User login          |
| [**authMeGet**](AuthApi.md#authmeget)                       | **GET** /auth/me             | Get user profile    |
| [**authRefreshPost**](AuthApi.md#authrefreshpost)           | **POST** /auth/refresh       | Refresh token       |
| [**authRegisterPost**](AuthApi.md#authregisterpost)         | **POST** /auth/register      | Register new user   |
| [**authUpdateProfilePut**](AuthApi.md#authupdateprofileput) | **PUT** /auth/update-profile | Update user profile |

## authLoginPost

> AuthLoginPost200Response authLoginPost(request)

User login

Authenticate user with email and password

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthLoginPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // RequestsLoginParam | Login credentials
    request: ...,
  } satisfies AuthLoginPostRequest;

  try {
    const data = await api.authLoginPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name        | Type                                        | Description       | Notes |
| ----------- | ------------------------------------------- | ----------------- | ----- |
| **request** | [RequestsLoginParam](RequestsLoginParam.md) | Login credentials |       |

### Return type

[**AuthLoginPost200Response**](AuthLoginPost200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description           | Response headers |
| ----------- | --------------------- | ---------------- |
| **200**     | OK                    | -                |
| **401**     | Unauthorized          | -                |
| **500**     | Internal Server Error | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## authMeGet

> AuthMeGet200Response authMeGet()

Get user profile

Get current authenticated user profile

### Example

```ts
import { Configuration, AuthApi } from '';
import type { AuthMeGetRequest } from '';

async function example() {
  console.log('🚀 Testing  SDK...');
  const config = new Configuration({
    // To configure API key authorization: BearerAuth
    apiKey: 'YOUR API KEY',
  });
  const api = new AuthApi(config);

  try {
    const data = await api.authMeGet();
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

[**AuthMeGet200Response**](AuthMeGet200Response.md)

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

## authRefreshPost

> AuthLoginPost200Response authRefreshPost(request)

Refresh token

Get new access token using refresh token

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthRefreshPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // RequestsRefreshParam | Refresh token
    request: ...,
  } satisfies AuthRefreshPostRequest;

  try {
    const data = await api.authRefreshPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name        | Type                                            | Description   | Notes |
| ----------- | ----------------------------------------------- | ------------- | ----- |
| **request** | [RequestsRefreshParam](RequestsRefreshParam.md) | Refresh token |       |

### Return type

[**AuthLoginPost200Response**](AuthLoginPost200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description           | Response headers |
| ----------- | --------------------- | ---------------- |
| **200**     | OK                    | -                |
| **401**     | Unauthorized          | -                |
| **500**     | Internal Server Error | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## authRegisterPost

> AuthLoginPost200Response authRegisterPost(request)

Register new user

Create a new user account

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthRegisterPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // RequestsRegisterParam | Registration details
    request: ...,
  } satisfies AuthRegisterPostRequest;

  try {
    const data = await api.authRegisterPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name        | Type                                              | Description          | Notes |
| ----------- | ------------------------------------------------- | -------------------- | ----- |
| **request** | [RequestsRegisterParam](RequestsRegisterParam.md) | Registration details |       |

### Return type

[**AuthLoginPost200Response**](AuthLoginPost200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description           | Response headers |
| ----------- | --------------------- | ---------------- |
| **200**     | OK                    | -                |
| **400**     | Bad Request           | -                |
| **500**     | Internal Server Error | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## authUpdateProfilePut

> AuthMeGet200Response authUpdateProfilePut(request)

Update user profile

Update current authenticated user profile

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthUpdateProfilePutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // To configure API key authorization: BearerAuth
    apiKey: "YOUR API KEY",
  });
  const api = new AuthApi(config);

  const body = {
    // RequestsUpdateProfileParam | Profile update details
    request: ...,
  } satisfies AuthUpdateProfilePutRequest;

  try {
    const data = await api.authUpdateProfilePut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name        | Type                                                        | Description            | Notes |
| ----------- | ----------------------------------------------------------- | ---------------------- | ----- |
| **request** | [RequestsUpdateProfileParam](RequestsUpdateProfileParam.md) | Profile update details |       |

### Return type

[**AuthMeGet200Response**](AuthMeGet200Response.md)

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
