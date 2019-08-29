var express = require('express')
var peopleRoutes = express()
var adminScopeAuthMiddleware = require('./../middlewares/authMiddlewares').adminScopeAuthMiddleware
var pythonAddress = require('./../../python/addGetter')

var people = new (require('../../database/models/people'))()

/** related to crawling python script **/
var myPythonScriptPath = pythonAddress() + '/GoogleCrawler.py';
var {PythonShell} = require('python-shell');

let options = {
    pythonPath : "/usr/bin/python3.6",
};
/***************************************/

peopleRoutes.post('/addPersonForCrowl', adminScopeAuthMiddleware, (req, res)=>{
    let {name} = req.body

    people.doesPersonExist(name).then(r=>{
        if (r === false){
            people.setValues([
                name,
                false
            ])
            people.save().then(r=>{
                res.status(200).json({
                    res : 1,
                    msg : "person successfully added!"
                })
            }).catch(e=>{
                res.status(500).json({
                    res : -1,
                    msg : "error happened in adding person!" + e
                })
            })
        }else{
            res.status(200).json({
                res : 0,
                msg : "there exist this name already" 
            })
        }
    }).catch(e =>{
        res.status(500).json({
            res : -1,
            msg : "error happened in adding person2!" + e
        })
    })
})

peopleRoutes.post('/crawlImages', adminScopeAuthMiddleware, (req, res)=>{
    var pyshell = new PythonShell(myPythonScriptPath, options);
    
    pyshell.on('message', function (message) {
        console.log(message)
    });
    
    // end the input stream and allow the process to exit
    pyshell.end(function (err) {
        if (err){
            throw err;
        };
        console.log('python execution finished');
    });
    res.json({
        status : 1,
        msg : 'running the google crawler script is successfully started'
    })
})



module.exports = peopleRoutes