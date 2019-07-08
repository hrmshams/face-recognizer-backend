var Model = require('./../model')

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
}

module.exports = AccessTokens