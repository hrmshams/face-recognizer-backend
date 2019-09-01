var Model = require('./model')

class Users extends Model {
    constructor(){
        super("users")

        this.model = this.setModel()
    }

    setModel(){
        return {
            id : [Model.types.int, Model.properties.notNull, Model.properties.autoIncrement],
            username : [Model.types.varchar, Model.properties.notNull],
            password : [Model.types.varchar, Model.properties.notNull]
        }
    }

    doesUserExist(username) {
        let self = this
        return new Promise (function(resolve, reject){
            self.where(`username = '${username}'`)
            .then(res=>{
                if (res.length > 0){
                    resolve(true)
                }else{
                    resolve(false)
                }
            }).catch(err=>{
                reject('error in getUserFromCrentials : ', err)
            })
    
        })
    }

    registerUserInDB(username, password){
        let self = this
        
        return new Promise(function(resolve, reject){
            self.setValues([
                username, 
                {val : `SHA('${password}')`, noQuote : true}
            ])
            self.save(false)
            .then(res=>{
                resolve(res)
            })
            .catch(err=>{
                reject(err)
            })    
    
        })
    }
      
    isUserAdmin(username) {
		console.log('aaaaaaaaaaaaaaaa')
        let self = this
        return new Promise (function(resolve, reject){
            self.where(`username = '${username}'`)
            .then(res=>{
                if (res.length > 0){
                    if (res[0].is_admin === 1)
                        resolve(true)
                    else
                        resolve(false)
                }else{
                    resolve(-1)
                }
            }).catch(err=>{
                reject('error in getUserFromCrentials : ', err)
            })
    
        })
    }

}

module.exports = Users