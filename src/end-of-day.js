"use strict";

const curry = require("crocks/helpers/curry");
const map = require("crocks/pointfree/map");
const pipe = require("crocks/helpers/pipe");

const {
	HttpRequestMethod,
	getHttpResponse
} = require("@api-sdk-creator/http-api-client");

// endOfDay :: HttpApiClient -> String -> Object -> Async Error Object
const endOfDay = curry((client, ticker, opts) =>
	pipe(
		client,
		map(getHttpResponse)
	)({
		method: HttpRequestMethod.GET,
		url: "/api/eod/:ticker",
		headers: {},
		pathParams: {
			ticker
		},
		queryParams: opts
	})
)

module.exports = {
	endOfDay
}
