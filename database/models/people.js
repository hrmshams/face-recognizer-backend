var Model = require('./model')

class Users extends Model {
    constructor(){
        super("people")

        this.model = this.setModel()
    }

    setModel(){
        return {
            id : [Model.types.int, Model.properties.notNull, Model.properties.autoIncrement],
            name : [Model.types.varchar, Model.properties.notNull],
            is_crawled : [Model.types.varchar, Model.properties.notNull]
        }
    }

    doesPersonExist(name) {
        let self = this
        return new Promise (function(resolve, reject){
            self.where(`name = '${name}'`)
            .then(res=>{
                if (res.length > 0){
                    resolve(true)
                }else{
                    resolve(false)
                }
            }).catch(err=>{
                reject('error in geting user : ', err)
            })
    
        })
    }

}

module.exports = Users