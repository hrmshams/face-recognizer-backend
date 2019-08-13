var normalRoutes = require('./normalRoutes')
var credentialRoutes = require('./credintialRoutes.js')

module.exports = (app) => {
    expressApp = app
    return {
        configRoutes,
    }
}

var configRoutes = ()=>{
    expressApp.use('/api/credential', credentialRoutes)
    expressApp.use('/api', normalRoutes)
}
