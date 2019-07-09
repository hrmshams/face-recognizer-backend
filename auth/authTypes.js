/**
 * requests which need to get a token
 * have to pass this middle ware
 */
function userScopeAuthMiddleware(req, res, next) {
	var options = {
		scope : "user",
	}
	var request = new Request(req);
	var response = new Response(res);

	return expressApp.oauth.authenticate(request, response, options)
		.then(function(token) {
			console.log(options)
			next();
		}).catch(function(err) {
			console.log(options)
			res.status(err.code || 500).json(err);
		});
}

module.exports = {
    userScopeAuthMiddleware
}