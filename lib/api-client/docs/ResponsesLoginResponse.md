# ResponsesLoginResponse

## Properties

| Name                    | Type                                              |
| ----------------------- | ------------------------------------------------- |
| `authUrl`               | string                                            |
| `refreshToken`          | string                                            |
| `refreshTokenExpiredAt` | string                                            |
| `state`                 | string                                            |
| `token`                 | string                                            |
| `tokenExpiredAt`        | string                                            |
| `user`                  | [ResponsesUserResponse](ResponsesUserResponse.md) |

## Example

```typescript
import type { ResponsesLoginResponse } from '';

// TODO: Update the object below with actual values
const example = {
  authUrl: null,
  refreshToken: null,
  refreshTokenExpiredAt: null,
  state: null,
  token: null,
  tokenExpiredAt: null,
  user: null,
} satisfies ResponsesLoginResponse;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ResponsesLoginResponse;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
