var express = require('express')
var normalRoutes = express()
var users = new (require('./../database/models/users.js'))()

normalRoutes.get('/', (req, res)=>{
	res.status(200).json({res : '/user route allowed'})
})

normalRoutes.post('/register', (req, res)=>{

    let {username, password} = req.body
    users.doesUserExist(username).then(respond=>{
        if(respond === true){
            res.status(200).json({
                res : 0,
                msg : 'user exists'
            })
        }
        else{
            users.registerUserInDB(username, password).then(respond=>{
                res.status(200).json({
                    res : 1,
                    msg : 'user successfully registered'
                })
            }).catch(error=>{
                res.status(500).json({
                    res : -1,
                    msg : 'error in registering user happened!' + error
                })
            })
        }
    }).catch(error=>{
        res.status(500).json({
            res : -1,
            msg : 'internal error! : '+ error
        })
    })
})


module.exports = normalRoutes