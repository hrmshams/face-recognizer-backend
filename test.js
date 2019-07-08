var AccessTokensModel = require('./database/models/accessTokens')
var sqlWrapper = require('./database/sqlWrapper')

accessTokenModel = new AccessTokensModel()
accessTokenModel.setValues([13,"accesstokentesti", "12411", "clientIDTEst","test scope"])
let query = sqlWrapper.insertQueryMaker(accessTokenModel, true)
let query2 = sqlWrapper.selectQueryMaker("*", accessTokenModel.tableName, "user_id=2")

console.log(query2)