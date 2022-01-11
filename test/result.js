"use strict";

function httpResult(request, response) {
	return {
		request,
		response
	}
}

module.exports = {
	httpResult
}
