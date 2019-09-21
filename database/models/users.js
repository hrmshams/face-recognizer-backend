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
            password : [Model.types.varchar, Model.properties.notNull],
            is_admin : [Model.types.bool, Model.properties.notNull],
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
                {val : `SHA('${password}')`, noQuote : true},
                0
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

    getUser(user_id) {
        let self = this
        return new Promise (function(resolve, reject){
            self.where(`id = '${user_id}'`)
            .then(res=>{
                if (res.length > 0){
                    res[0].password = undefined
                    resolve(res[0])
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