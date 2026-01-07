# ResponsesLinkResponse

## Properties

| Name              | Type   |
| ----------------- | ------ |
| `clickCount`      | number |
| `createdAt`       | string |
| `customShortCode` | string |
| `expiredAt`       | string |
| `id`              | string |
| `originalUrl`     | string |
| `shortCode`       | string |

## Example

```typescript
import type { ResponsesLinkResponse } from '';

// TODO: Update the object below with actual values
const example = {
  clickCount: null,
  createdAt: null,
  customShortCode: null,
  expiredAt: null,
  id: null,
  originalUrl: null,
  shortCode: null,
} satisfies ResponsesLinkResponse;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ResponsesLinkResponse;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
