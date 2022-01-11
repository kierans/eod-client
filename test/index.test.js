"use strict";

const { assertThat, is } = require("hamjest");

describe("test", function() {
	it("should assert true", function() {
		assertThat(true, is(true));
	})
});
