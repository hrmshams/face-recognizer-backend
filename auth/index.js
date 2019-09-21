var OAuth2Server = require('oauth2-server')

module.exports = (expressApp) => {
    let model = require('./model')()

    expressApp.oauth = new OAuth2Server({
        model: model,

        // WARNING : WHAT ARE TWO NEXT ARGUMENTS?
        accessTokenLifetime: 24 * 60 * 60, 
        allowBearerTokensInQueryString: true
    });
}
