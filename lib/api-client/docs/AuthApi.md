# AuthApi

All URIs are relative to _http://localhost:8080_

| Method                                                      | HTTP request                 | Description                 |
| ----------------------------------------------------------- | ---------------------------- | --------------------------- |
| [**authGoogleGet**](AuthApi.md#authgoogleget)               | **GET** /auth/google         | Google OAuth authentication |
| [**authLoginPost**](AuthApi.md#authloginpost)               | **POST** /auth/login         | User login                  |
| [**authMeGet**](AuthApi.md#authmeget)                       | **GET** /auth/me             | Get user profile            |
| [**authRefreshPost**](AuthApi.md#authrefreshpost)           | **POST** /auth/refresh       | Refresh token               |
| [**authRegisterPost**](AuthApi.md#authregisterpost)         | **POST** /auth/register      | Register new user           |
| [**authUpdateProfilePut**](AuthApi.md#authupdateprofileput) | **PUT** /auth/update-profile | Update user profile         |

## authGoogleGet

> AuthGoogleGet200Response authGoogleGet(code)

Google OAuth authentication

Authenticate or register user via Google OAuth. Use without code param to get redirect URL, with code param to complete authentication.

### Example

```ts
import { Configuration, AuthApi } from '';
import type { AuthGoogleGetRequest } from '';

async function example() {
  console.log('🚀 Testing  SDK...');
  const api = new AuthApi();

  const body = {
    // string | OAuth authorization code from Google callback (optional)
    code: code_example,
  } satisfies AuthGoogleGetRequest;

  try {
    const data = await api.authGoogleGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name     | Type     | Description                                   | Notes                                |
| -------- | -------- | --------------------------------------------- | ------------------------------------ |
| **code** | `string` | OAuth authorization code from Google callback | [Optional] [Defaults to `undefined`] |

### Return type

[**AuthGoogleGet200Response**](AuthGoogleGet200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description           | Response headers |
| ----------- | --------------------- | ---------------- |
| **200**     | OK                    | -                |
| **400**     | Bad Request           | -                |
| **500**     | Internal Server Error | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## authLoginPost

> AuthGoogleGet200Response authLoginPost(request)

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

[**AuthGoogleGet200Response**](AuthGoogleGet200Response.md)

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

> AuthGoogleGet200Response authRefreshPost(request)

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

[**AuthGoogleGet200Response**](AuthGoogleGet200Response.md)

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

> AuthGoogleGet200Response authRegisterPost(request)

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

[**AuthGoogleGet200Response**](AuthGoogleGet200Response.md)

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

> AuthMeGet200Response authUpdateProfilePut(name, email, password, profileImage)

Update user profile

Update current authenticated user profile with optional profile image upload

### Example

```ts
import { Configuration, AuthApi } from '';
import type { AuthUpdateProfilePutRequest } from '';

async function example() {
  console.log('🚀 Testing  SDK...');
  const config = new Configuration({
    // To configure API key authorization: BearerAuth
    apiKey: 'YOUR API KEY',
  });
  const api = new AuthApi(config);

  const body = {
    // string | User name (optional)
    name: name_example,
    // string | User email (optional)
    email: email_example,
    // string | User password (optional)
    password: password_example,
    // Blob | Profile image file (jpg, jpeg, png, gif) (optional)
    profileImage: BINARY_DATA_HERE,
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

| Name             | Type     | Description                              | Notes                                |
| ---------------- | -------- | ---------------------------------------- | ------------------------------------ |
| **name**         | `string` | User name                                | [Optional] [Defaults to `undefined`] |
| **email**        | `string` | User email                               | [Optional] [Defaults to `undefined`] |
| **password**     | `string` | User password                            | [Optional] [Defaults to `undefined`] |
| **profileImage** | `Blob`   | Profile image file (jpg, jpeg, png, gif) | [Optional] [Defaults to `undefined`] |

### Return type

[**AuthMeGet200Response**](AuthMeGet200Response.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description           | Response headers |
| ----------- | --------------------- | ---------------- |
| **200**     | OK                    | -                |
| **400**     | Bad Request           | -                |
| **401**     | Unauthorized          | -                |
| **500**     | Internal Server Error | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
