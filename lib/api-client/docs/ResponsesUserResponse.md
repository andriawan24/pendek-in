# ResponsesUserResponse

## Properties

| Name              | Type    |
| ----------------- | ------- |
| `email`           | string  |
| `id`              | string  |
| `isActive`        | boolean |
| `isVerified`      | boolean |
| `name`            | string  |
| `profileImageUrl` | string  |

## Example

```typescript
import type { ResponsesUserResponse } from '';

// TODO: Update the object below with actual values
const example = {
  email: null,
  id: null,
  isActive: null,
  isVerified: null,
  name: null,
  profileImageUrl: null,
} satisfies ResponsesUserResponse;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ResponsesUserResponse;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
