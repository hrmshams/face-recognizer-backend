var peopleRoutes = require('./controllers/peopleController')
var expressApp = require('./mainExpressApp').getMainExpressApp()

var userScopeAuthMiddleware = require('./middlewares/authMiddlewares').userScopeAuthMiddleware
/**
 * requests from users including normal users and admins 
 * are programmed in here.
 */

var express = require('express')
var credintialRoutes = express()

var OAuth2Server = require('oauth2-server'),
    Request = OAuth2Server.Request,
    Response = OAuth2Server.Response;

/**
 * routes
 */
credintialRoutes.post('/login', obtainToken)
credintialRoutes.get('/', userScopeAuthMiddleware, (req, res)=>{
    res.send('/auth route allowed')
})
credintialRoutes.use('/people', peopleRoutes)


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

module.exports = credintialRoutes
