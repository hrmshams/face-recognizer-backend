let expressApp = null

var normalRoutes = require('./normalRoutes')
var credentialRoutes = require('./credintialRoutes.js')()

module.exports = (app) => {
    expressApp = app

    return {
        configRoutes,
    }
}

var configRoutes = ()=>{
    credentialRoutes.passExpressApp(expressApp)
    expressApp.use('/api', normalRoutes)
    expressApp.use('/api/credential', credentialRoutes.routes)
}
