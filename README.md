# eod-client

JS client to use API of eodhistoricaldata.com

Can be used from node and the browser. Uses the [API SDK Creator][1] library.

## Coverage

Currently only supports calling EOD's
- End of day historical API

If there is another EOD endpoint that should be included, please open a PR.

## Usage

```shell
$ npm install eod-client

# install a HTTP client eg:
$ npm install @api-sdk-creator/axios-http-client
```

```javascript
const { createAxiosHttpClient } = require("@api-sdk-creator/axios-http-client");
const { apiClient, endOfDay } = require("eod-client");

const client = apiClient(
    createAxiosHttpClient(),
    "https://eodhistoricaldata.com",
    "YOUR_API_KEY"
);

const opts = {
    fmt: "json",
    from: "2021-07-01",
    to: "2021-12-31"
};

const resp = await endOfDay(apiClient, "TSLA.US", opts).toPromise();

/*
 * There are more elegant ways to switch on the response code. This is just for demonstration.
 */
if (resp.statusCode === 200) {
    const prices = resp.body
}

if (resp.statusCode === 404) {
    throw new Error("TSLA.US not found");
}
```

[1]: https://github.com/RedCrewOS/api-sdk-creator-js
