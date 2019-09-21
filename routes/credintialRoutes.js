var peopleRoutes = require('./controllers/peopleController')
var userRoutes = require('./controllers/userController')
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

credintialRoutes.get('/getUser', function(req, res, next) {
	// var options = {
	//     scope : "user",
	// }
	var request = new Request(req);
	var response = new Response(res);
 
	return expressApp.oauth.authenticate(request, response)
	    .then(function(token) {
			console.log(token)
			res.status(200).json(token)
		}).catch(function(err) {
			console.log(err)
			res.status(err.code || 500).json(err);
		});
})

credintialRoutes.use('/people', peopleRoutes)
credintialRoutes.use('/user', userRoutes)

function obtainToken(req, res) {
	var request = new Request(req);
	var response = new Response(res);

	return expressApp.oauth.token(request, response)
	.then(function(token) {
		res.json(token);
	}).catch(function(err) {
		console.log('ac to th : ' + err.code + " - " + err)
		res.status(err.code || 500).json(err);
	});
}

module.exports = credintialRoutes
