/**
 * requests from users including normal users and admins 
 * are programmed in here.
 */

var express = require('express')
var credintialRoutes = express()
var authTypes = require('./../auth/authTypes')

var OAuth2Server = require('oauth2-server'),
    Request = OAuth2Server.Request,
    Response = OAuth2Server.Response;

let expressApp = null

/**
 * routes
 */
credintialRoutes.get('/', authTypes.userScopeAuthMiddleware, (req, res)=>{
    res.send('/auth route allowed')
})
credintialRoutes.get('/getProfile', authTypes.userScopeAuthMiddleware, (req, res)=>{
	// todo getting profile
	res.send('/user route allowed')
})
credintialRoutes.post('/token', obtainToken)
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

module.exports = ()=>{
    return {
		routes : credintialRoutes,
		passExpressApp : passExpressApp
	}
}
