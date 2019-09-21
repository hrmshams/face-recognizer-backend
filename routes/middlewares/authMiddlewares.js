var expressApp = require('./../mainExpressApp').getMainExpressApp()

var OAuth2Server = require('oauth2-server'),
    Request = OAuth2Server.Request,
    Response = OAuth2Server.Response;

const userScopeAuthMiddleware = function(req, res, next) {
    var options = {
        scope : "user",
    }
    var request = new Request(req);
    var response = new Response(res);

    return expressApp.oauth.authenticate(request, response, options)
        .then(function(token) {
            console.log(token)
            next();
        }).catch(function(err) {
            console.log(options)
            res.status(err.code || 500).json(err);
        });
}

const adminScopeAuthMiddleware = function(req, res, next) {
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

module.exports = {
    userScopeAuthMiddleware,
    adminScopeAuthMiddleware
}