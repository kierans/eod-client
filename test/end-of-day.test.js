"use strict";

const { Async } = require("crocks");

const { HttpRequestMethod } = require("@api-sdk-creator/http-api-client");

const { assertThat, equalTo, is, hasProperties } = require("hamjest");

const { endOfDay } = require("../src/end-of-day");
const { httpResult } = require("./result");

describe("end of day data", function() {
	const ticker = "TSLA.US";
	const opts = {
		fmt: "json",
		from: "2021-04-21",
		to: "2021-04-22"
	}

	const tickerData = [
		{
			"date": "2021-04-21",
			"open": 704.77,
			"high": 744.84,
			"low": 698,
			"close": 744.12,
			"adjusted_close": 744.12,
			"volume": 31215510
		},
		{
			"date": "2021-04-22",
			"open": 741.5,
			"high": 753.77,
			"low": 718.04,
			"close": 719.69,
			"adjusted_close": 719.69,
			"volume": 35590262
		}
	]

	it("should send request", async function() {
		let request;
		const client = (req) => {
			request = req;
			return Async.Resolved(httpResult(req, okResponse(tickerData)))
		}

		await endOfDay(client, ticker, opts).toPromise();

		assertThat(request, is(hasProperties({
			method: equalTo(HttpRequestMethod.GET),
			url: equalTo("/api/eod/:ticker"),
			headers: equalTo({}),
			pathParams: {
				ticker
			},
			queryParams: opts
		})));
	});

	it("should return error if ticker not found", async function() {
		const resp = notFoundResponse();
		const client = (req) => Async.Resolved(httpResult(req, resp))

		const result = await endOfDay(client, ticker, opts).toPromise();

		assertThat(result, is(resp));
	});

	it("should return ticker data", async function() {
		const resp = okResponse(tickerData);
		const client = (req) => Async.Resolved(httpResult(req, resp))
		const result = await endOfDay(client, ticker, opts).toPromise();

		assertThat(result, equalTo(resp))
	});

	function notFoundResponse() {
		return {
			statusCode: 404,
			headers: {
				"Content-Type": "text/html; charset=UTF-8"
			},
			body: "Ticker Not Found."
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
