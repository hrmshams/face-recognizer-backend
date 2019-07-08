var TableModel = require('./../model')

class Users extends TableModel {
    constructor(){
        super("users")

        this.model = this.setModel()
    }

    setModel(){
        return {
            id : [this.types.int, this.properties.notNull, this.properties.autoIncrement],
            username : [this.types.varchar, this.properties.notNull],
            password : [this.types.varchar, this.properties.notNull]
        }
    }
}

module.exports = Users