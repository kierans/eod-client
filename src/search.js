"use strict";

const curry = require("crocks/helpers/curry");
const map = require("crocks/pointfree/map");
const pipe = require("crocks/helpers/pipe");

const { getHttpResponse, HttpRequestMethod } = require("@api-sdk-creator/http-api-client");

// search :: HttpClient -> String -> Object -> Async Error Object
const search = curry((client, ticker, opts) =>
	pipe(
		client,
		map(getHttpResponse)
	)({
		method: HttpRequestMethod.GET,
		url: "/api/search/:ticker",
		headers: {},
		pathParams: {
			ticker
		},
		queryParams: opts
	})
)

module.exports = {
	search
}
