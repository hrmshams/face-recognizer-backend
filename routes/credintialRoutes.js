var peopleRoutes = require('./controllers/peopleController')
var expressApp = require('./mainExpressApp').getMainExpressApp()

var userScopeAuthMiddleware = require('./middlewares/authMiddlewares').userScopeAuthMiddleware

var users = new (require('./../database/models/users'))()

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
credintialRoutes.post('/login', (req, res, next)=> {
	users.isUserAdmin(req.body.username).then(res=>{
		if (res === true){
			req.body.scope = "user admin"
		} else {
			req.body.scope = "user"
		}
		console.log('access' + JSON.stringify(req.body))
		next()
	}).catch(err=>{
		console.log('error happened in loggin in and getting userType : ', err)
		res.json({status : -1, msg : "error in detecting user type"})
	})
},obtainToken)

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
