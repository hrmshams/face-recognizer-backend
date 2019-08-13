var peopleRoutes = require('./controllers/peopleController')
/**
 * requests from users including normal users and admins 
 * are programmed in here.
 */

var express = require('express')
var credintialRoutes = express()

var OAuth2Server = require('oauth2-server'),
    Request = OAuth2Server.Request,
    Response = OAuth2Server.Response;

let expressApp = null

/**
 * routes
 */
credintialRoutes.post('/login', obtainToken)
credintialRoutes.get('/', userScopeAuthMiddleware, (req, res)=>{
    res.send('/auth route allowed')
})
credintialRoutes.use('/people', peopleRoutes)

/**
 * 
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

function adminScopeAuthMiddleware(req, res, next) {
	var options = {
		scope : "user admin",
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
/*
*/

var passExpressApp = function(app){
	expressApp = app
}

module.exports = {
	routes : credintialRoutes,
	passExpressApp : passExpressApp,
	adminScopeAuthMiddleware,
	userScopeAuthMiddleware
}
