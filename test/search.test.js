"use strict";

const { Async } = require("crocks");

const { HttpRequestMethod } = require("@api-sdk-creator/http-api-client");

const { assertThat, equalTo, is, hasProperties } = require("hamjest");

const { search } = require("../src/search");
const { httpResult } = require("./result");

describe("search results", function() {
	const ticker = "TSLA.US";
	const opts = {
		limit: 5
	}

	const searchResults = [
		{
			Code: "TSLA",
			Exchange: "US",
			Name: "Tesla Inc",
			Type: "Common Stock",
			Country: "USA",
			Currency: "USD",
			ISIN: "US88160R1014",
			previousClose: 1058.12,
			previousCloseDate: "2022-01-10"
		}
	]

	it("should send request", async function() {
		let request;
		const client = (req) => {
			request = req;
			return Async.Resolved(httpResult(req, okResponse(searchResults)))
		}

		await search(client, ticker, opts).toPromise();

		assertThat(request, is(hasProperties({
			method: equalTo(HttpRequestMethod.GET),
			url: equalTo("/api/search/:ticker"),
			headers: equalTo({}),
			pathParams: {
				ticker
			},
			queryParams: opts
		})));
	});

	it("should return error", async function() {
		const resp = internalServerError();
		const client = (req) => Async.Resolved(httpResult(req, resp))

		const result = await search(client, ticker, opts).toPromise();

		assertThat(result, is(resp));
	});

	it("should return search results", async function() {
		const resp = okResponse(searchResults);
		const client = (req) => Async.Resolved(httpResult(req, resp))
		const result = await search(client, ticker, opts).toPromise();

		assertThat(result, equalTo(resp))
	});

	function internalServerError() {
		return {
			statusCode: 500,
			headers: {
				"Content-Type": "text/html; charset=UTF-8"
			},
			body: "Something went wrong."
		}
	}

	function okResponse(body) {
		return {
			statusCode: 200,
			headers: {
				"Content-Type": "application/json"
			},
			body
		}
	}
});
