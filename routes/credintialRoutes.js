var express = require('express')
var credintialRoutes = express()

var OAuth2Server = require('oauth2-server'),
    Request = OAuth2Server.Request,
    Response = OAuth2Server.Response;

let expressApp = null

function authenticateRequest(req, res, next) {
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

credintialRoutes.get('/', authenticateRequest, (req, res)=>{
    res.send('/ route allowed')
})

credintialRoutes.get('/user', authenticateRequest, (req, res)=>{
    res.send('/user route allowed')
})

credintialRoutes.all('/token', obtainToken)
function obtainToken(req, res) {
	var request = new Request(req);
	var response = new Response(res);

	return expressApp.oauth.token(request, response)
		.then(function(token) {

			res.json(token);
		}).catch(function(err) {

			res.status(err.code || 500).json(err);
		});
}

var passExpressApp = function(app){
	expressApp = app
}

module.exports = ()=>{
    return {
		routes : credintialRoutes,
		passExpressApp : passExpressApp
	}
}
