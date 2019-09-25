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

    setDate(){
        let date =(new Date()).toString()
        this.update('id=1',`last_vector_date='${date}'`).then(res=>{
            console.log(res)
        }).catch(err=>{
            console.log(err)
        })
    }

}

module.exports = Status