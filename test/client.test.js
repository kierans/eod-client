"use strict";

const { Async } = require("crocks");

const { HttpRequestMethod } = require("@api-sdk-creator/http-api-client");

const { assertThat, equalTo, is } = require("hamjest");

const { apiClient } = require("../src/client");

const origin = "http://localhost:3000";
const apiKey = "abc123";

describe("API client", function() {
	const reqBody = {
		a: 1
	}

	const req = {
		method: HttpRequestMethod.GET,
		url: "/",
		headers: {},
		body: reqBody
	}

	const respBody = {
		b: 2
	}

	let request;
	let client;

	beforeEach(function() {
		setServerToReturnJSON();
	});

	it("should resolve url", async function() {
		await sendRequest();

		assertThat(request.url, is(`${origin}/`));
	});

	it("should set api key", async function() {
		await sendRequest();

		assertThat(request.headers["authorization"], is(`Bearer ${apiKey}`));
	});

	it("should marshall JSON in request body", async function() {
		await sendRequest();

		assertThat(request.headers["content-type"], is("application/json"));
		assertThat(typeof request.body, is("string"));
	});

	it("should unmarshall JSON response", async function() {
		const result = await sendRequest();

		assertThat(result.response.body, is(equalTo(respBody)));
	});

	it("should passthrough HTML response", async function() {
		const message = "This is a message";
		setServerToReturnHTML(message)

		const result = await sendRequest();

		assertThat(result.response.body, is(equalTo(message)));
	});

	function setServerToReturnJSON() {
		client = (req) => {
			request = req;

			return Async.Resolved({
				request: req,
				response: {
					statusCode: 200,
					headers: {
						"content-type": "application/json"
					},
					body: JSON.stringify(respBody)
				}
			});
		}
	}

	function setServerToReturnHTML(html) {
		client = (req) => {
			request = req;

			return Async.Resolved({
				request: req,
				response: {
					statusCode: 200,
					headers: {
						"content-type": "text/html; charset=utf8"
					},
					body: html
				}
			});
		}
	}

	function sendRequest() {
		return apiClient(client, origin, apiKey)(req).toPromise()
	}
});
