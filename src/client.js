"use strict";

const Async = require("crocks/Async");

const compose = require("crocks/helpers/compose");
const curry = require("crocks/helpers/curry");
const pipeK = require("crocks/helpers/pipeK");
const resultToAsync = require("crocks/Async/resultToAsync");

const {
	addHeaders,
	bearerToken,
	jsonMarshaller,
	resolveUrl,
	unmarshaller,
	unmarshallerFor,
	JSON_MIME_TYPE,
} = require("@api-sdk-creator/http-api-client");

const { parse } = require("@epistemology-factory/crocks-ext/node/json");

const HTML_MIME_TYPE = "text/html";

// apiClient :: HttpClient -> String -> String -> HttpApiClient
const apiClient = curry((httpClient, origin, apiKey) =>
	pipeK(
		resolveUrl(origin),
		addHeaders(bearerToken(() => Async.Resolved(apiKey))),
		jsonMarshaller(),
		httpClient,
		unmarshaller(
			unmarshallerFor(JSON_MIME_TYPE, compose(resultToAsync, parse)),

			/*
			 * EOD sends plain text strings for errors with the HTML content type.
			 */
			unmarshallerFor(HTML_MIME_TYPE, Async.Resolved)
		)
	)
)

module.exports = {
	apiClient
}
