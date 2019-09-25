var Model = require('./model')

class People extends Model {
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

    getPeople(is_crawled) {
        let self = this
        return new Promise (function(resolve,reject){
            self.where(`is_crawled='${is_crawled}'`)
        .then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
        })
    }

    getUnpreprocessPeople(is_preprocessed) {
        let self = this
        return new Promise (function(resolve,reject){
            self.where(`is_preprocessed='${is_preprocessed}'`)
        .then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
        })
    }

}

module.exports = People