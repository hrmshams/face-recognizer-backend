let mainExpressApp = null

const getMainExpressApp = function(){
    return mainExpressApp
}
const setMainExpressApp = function(app){
    mainExpressApp = app
}

module.exports = {
    getMainExpressApp,
    setMainExpressApp
}