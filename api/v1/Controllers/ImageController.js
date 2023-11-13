const tryCatchAsync = require("../../../util/tryCatchAsync");
const apiResponse = require("../../../util/apiResponse");


exports.imageUpload = tryCatchAsync(async (req, res, next) => {

	const url = req.file.path;
	let response_data = { url };
	return apiResponse.successResponse(res, response_data, "success", 200);
});