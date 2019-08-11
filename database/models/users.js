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

        this.setValues([
            username, 
            SHA(`'${password}'`)
        ])
        this.save(true)
        .then(res=>{
            console.log('successfully query executed , res : ' + res)
        })
        .catch(err=>{
            console.log('successfully query executed , err : ' + err)
        })    
    }
      
}

module.exports = Users