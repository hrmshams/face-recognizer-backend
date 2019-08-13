var express = require('express')
var normalRoutes = express()
var users = new (require('./../database/models/users.js'))()
var pythonAddress = require('./../python/addGetter')

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

var myPythonScriptPath = pythonAddress() + '/test.py';
var {PythonShell} = require('python-shell');

normalRoutes.post('/runp', (req, res)=>{
    var pyshell = new PythonShell(myPythonScriptPath);
    
    pyshell.on('message', function (message) {
        res.send(message)
    });
    
    // end the input stream and allow the process to exit
    pyshell.end(function (err) {
        if (err){
            throw err;
        };
    
        console.log('python execution finished');
    });
})

var fs = require('fs');
normalRoutes.get('/getp', (req, res)=>{
    fs.readFile('./../data/status.txt', function (err, data) {
        res.end(data)
    });
})


module.exports = normalRoutes