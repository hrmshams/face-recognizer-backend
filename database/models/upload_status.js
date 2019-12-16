var Model = require("./model")

class UploadStatus extends Model {
    constructor() {
        super("upload_status")

        this.model = this.setModel()
    }

    setModel() {
        return {
            user_id: [Model.types.varchar, Model.properties.notNull],
            status: [Model.types.varchar, Model.properties.notNull],
            p_person: [Model.types.varchar, Model.properties.notNull],
            confidence: [Model.types.varchar, Model.properties.notNull]
        }
    }

    setDate() {
        let date = new Date().toString()
        this.update("id=1", `last_vector_date='${date}'`)
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    registerUserStatusInDB(user_id) {
        let self = this

        return new Promise(function(resolve, reject) {
            self.setValues([user_id, "nothing", "", ""])
            self.save(false)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
}

module.exports = UploadStatus
