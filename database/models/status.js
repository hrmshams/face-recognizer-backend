var Model = require('./model')

class Status extends Model {
    constructor(){
        super("status")

        this.model = this.setModel()
    }

    setModel(){
        return {
            is_crawling : [Model.types.varchar, Model.properties.notNull]
        }
    }

}

module.exports = Status