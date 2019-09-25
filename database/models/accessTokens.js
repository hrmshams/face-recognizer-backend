var Model = require('./model')
var sqlWrapper = require('./../sqlWrapper')
var DatabaseConnection = require('./../databaseConnection')

class AccessTokens extends Model {
    constructor(){
        super("access_tokens")

        this.model = this.setModel()
        this.key = "user_id"
        this.keyIndex = 0
    }

    // (user_id, access_token, access_token_expire, client_id, scope)
    setModel(){
        return {
            user_id : [Model.types.int, Model.properties.notNull, Model.properties.unique],
            access_token : [Model.types.varchar, Model.properties.notNull],
            access_token_expire : [Model.types.varchar, Model.properties.notNull],
            client_id : [Model.types.varchar, Model.properties.notNull],
            scope : [Model.types.varchar],
        }
    }

    deleteAccessToken(id) {
        const deleteUserQuery = sqlWrapper.deleteQueryMaker(this.tableName, `user_id='${id}'`)
        return new Promise(function(resolve, reject){
            DatabaseConnection.query(deleteUserQuery)
            .then(res=>{
                resolve(res)
            })
            .catch(err=>{
                reject(err)
            })
        })
    }

}

module.exports = AccessTokens