var Model = require("./model")
var sqlWrapper = require("./../sqlWrapper")
var DatabaseConnection = require("./../databaseConnection")

class Users extends Model {
    constructor() {
        super("users")

        this.model = this.setModel()
    }

    setModel() {
        return {
            id: [
                Model.types.int,
                Model.properties.notNull,
                Model.properties.autoIncrement
            ],
            username: [Model.types.varchar, Model.properties.notNull],
            password: [Model.types.varchar, Model.properties.notNull],
            is_admin: [Model.types.bool, Model.properties.notNull]
        }
    }

    doesUserExist(username) {
        let self = this
        return new Promise(function(resolve, reject) {
            self.where(`username = '${username}'`)
                .then(res => {
                    if (res.length > 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                })
                .catch(err => {
                    reject("error in getUserFromCrentials : ", err)
                })
        })
    }

    registerUserInDB(username, password) {
        let self = this

        return new Promise(function(resolve, reject) {
            self.setValues([
                username,
                { val: `SHA('${password}')`, noQuote: true },
                0
            ])
            self.save(false)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    getUserByUsername(username) {
        let self = this
        return new Promise(function(resolve, reject) {
            self.where(`username = '${username}'`)
                .then(res => {
                    resolve(res[0])
                })
                .catch(err => {
                    reject("error in getUserFromCrentials : ", err)
                })
        })
    }

    getUser(user_id) {
        let self = this
        return new Promise(function(resolve, reject) {
            self.where(`id = '${user_id}'`)
                .then(res => {
                    if (res.length > 0) {
                        res[0].password = undefined
                        resolve(res[0])
                    } else {
                        resolve(-1)
                    }
                })
                .catch(err => {
                    reject("error in getUserFromCrentials : ", err)
                })
        })
    }

    getAll() {
        const getUserIDQuery = sqlWrapper.selectQueryMaker(
            ["id", "username", "is_admin"],
            this.tableName,
            "id!=2"
        )
        return new Promise(function(resolve, reject) {
            DatabaseConnection.query(getUserIDQuery)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    deleteUser(id) {
        const deleteUserQuery = sqlWrapper.deleteQueryMaker(
            this.tableName,
            `id='${id}'`
        )
        return new Promise(function(resolve, reject) {
            DatabaseConnection.query(deleteUserQuery)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    promoteDemote(id, isPromote) {
        let is_admin = isPromote

        let self = this
        return new Promise(function(resolve, reject) {
            self.update(`id='${id}'`, `is_admin=${is_admin}`)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
}

module.exports = Users
