let express = require("express")
let normalRoutes = express()
let users = new (require("./../database/models/users.js"))()
let upload_status = new (require("./../database/models/upload_status"))()

normalRoutes.get("/", (req, res) => {
    res.status(200).json({ res: "/user route allowed" })
})

normalRoutes.post("/register", (req, res) => {
    let { username, password } = req.body
    users
        .doesUserExist(username)
        .then(respond => {
            if (respond === true) {
                res.status(200).json({
                    res: 0,
                    msg: "user exists"
                })
            } else {
                users
                    .registerUserInDB(username, password)
                    .then(response => {
                        if (response.affectedRows === 1) {
                            users
                                .where(`username='${username}'`)
                                .then(r => {
                                    let id = r[0].id
                                    upload_status
                                        .registerUserStatusInDB(id)
                                        .then(r => {
                                            res.status(200).json({
                                                res: 1,
                                                msg:
                                                    "user successfully registered"
                                            })
                                        })
                                        .catch(err => {
                                            console.log(err)
                                            res.status(500).json({
                                                res: 1,
                                                msg:
                                                    "couldn't register upload_status!"
                                            })
                                        })
                                })
                                .catch(err => {
                                    console.log(err)
                                    res.status(500).json({
                                        res: 1,
                                        msg: "couldn't find registered user!!!"
                                    })
                                })
                        }
                    })
                    .catch(error => {
                        console.log("ac1" + error)
                        error.status(500).json({
                            res: -1,
                            msg: "error in registering user happened!" + error
                        })
                    })
            }
        })
        .catch(error => {
            console.log("ac2")
            res.status(500).json({
                res: -1,
                msg: "internal error! : " + error
            })
        })
})

module.exports = normalRoutes
