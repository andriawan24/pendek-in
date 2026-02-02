# ResponsesDashboardResponse

## Properties

| Name               | Type                                                                   |
| ------------------ | ---------------------------------------------------------------------- |
| `overviews`        | [Array&lt;ResponsesAnalyticOverview&gt;](ResponsesAnalyticOverview.md) |
| `recents`          | [Array&lt;ResponsesLinkResponse&gt;](ResponsesLinkResponse.md)         |
| `topLink`          | [ResponsesTopLink](ResponsesTopLink.md)                                |
| `totalActiveLinks` | number                                                                 |
| `totalClicks`      | number                                                                 |

## Example

```typescript
import type { ResponsesDashboardResponse } from '';

// TODO: Update the object below with actual values
const example = {
  overviews: null,
  recents: null,
  topLink: null,
  totalActiveLinks: null,
  totalClicks: null,
} satisfies ResponsesDashboardResponse;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ResponsesDashboardResponse;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
