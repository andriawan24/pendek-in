# ResponsesAnalyticsResponse

## Properties

| Name               | Type                                                                   |
| ------------------ | ---------------------------------------------------------------------- |
| `avgDailyClick`    | number                                                                 |
| `browserUsages`    | [Array&lt;ResponsesTypeValue&gt;](ResponsesTypeValue.md)               |
| `deviceBreakdowns` | [Array&lt;ResponsesTypeValue&gt;](ResponsesTypeValue.md)               |
| `fromDate`         | string                                                                 |
| `overviews`        | [Array&lt;ResponsesAnalyticOverview&gt;](ResponsesAnalyticOverview.md) |
| `timeRange`        | string                                                                 |
| `toDate`           | string                                                                 |
| `topCountries`     | [Array&lt;ResponsesTypeValue&gt;](ResponsesTypeValue.md)               |
| `topLink`          | [ResponsesTopLink](ResponsesTopLink.md)                                |
| `totalActiveLinks` | number                                                                 |
| `totalClicks`      | number                                                                 |
| `trafficSources`   | [Array&lt;ResponsesTypeValue&gt;](ResponsesTypeValue.md)               |

## Example

```typescript
import type { ResponsesAnalyticsResponse } from '';

// TODO: Update the object below with actual values
const example = {
  avgDailyClick: null,
  browserUsages: null,
  deviceBreakdowns: null,
  fromDate: null,
  overviews: null,
  timeRange: null,
  toDate: null,
  topCountries: null,
  topLink: null,
  totalActiveLinks: null,
  totalClicks: null,
  trafficSources: null,
} satisfies ResponsesAnalyticsResponse;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ResponsesAnalyticsResponse;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
