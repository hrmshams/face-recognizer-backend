var express = require('express')
var peopleRoutes = express()
var adminScopeAuthMiddleware = require('./../middlewares/authMiddlewares').adminScopeAuthMiddleware
var pythonAddress = require('./../../image_processing_core/addGetter')

var people = new (require('../../database/models/people'))()
var status = new (require('../../database/models/status'))()

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
                0
            ])
            people.save().then(r=>{
                res.status(200).json({
                    status : 1,
                    msg : "person successfully added!"
                })
            }).catch(e=>{
                let msg = "error happened in adding person!" + e
                console.log(msg)
                res.status(500).json({
                    status : -1,
                    msg : msg
                })
            })
        }else{
            res.status(200).json({
                status : 0,
                msg : "there exist this name already" 
            })
        }
    }).catch(e =>{
        res.status(500).json({
            status : -1,
            msg : "error happened in adding person2!" + e
        })
    })
})

peopleRoutes.post('/crawlImages', adminScopeAuthMiddleware, (req, res)=>{
    var pyshell = new PythonShell(myPythonScriptPath, options);
    
    // status.all().then(r=>{
    //     console.log(r)
    //     res.json(r)
    // }).catch(e=>{
    //     res.json(e)
    // })

    pyshell.on('message', function (message) {
        console.log(message)
    });
    
    // end the input stream and allow the process to exit
    pyshell.end(function (err) {
        if (err){
            throw err;
        };
        console.log('python crawling script finished');
        status.update('is_crawling=1', 'is_crawling=0').then(res=>{
            console.log('successfully changes the status : ', res)
        }).catch(err=>{
            console.log('couldnt change the status : ', err)
        })
    });
    res.json({
        status : 1,
        msg : 'running the google crawler script is successfully started'
    })
})

peopleRoutes.get('/getPeople', adminScopeAuthMiddleware, (req, res)=>{
    let p_crawled = people.getPeople(1)
    let p_not_crawled = people.getPeople(0)

    Promise.all([p_not_crawled, p_crawled]).then(function(vals){
        if (vals && (vals[0].length>0 || vals[1].length>0)){
            res.status(200).json({
                status : 1,
                not_crawled : vals[0], 
                crawled : vals[1], 
            })
        }else{
            res.status(200).json({
                status : 0,
                msg : 'there is no record!'
            })
        }
    }).catch(function(err){
        console.log(err)
    })
    // people.all().then(r=>{
    //     if (r && r.length>0){
    //         res.status(200).json({
    //             status : 1,
    //             people : r
    //         })
    //     }else{
    //         res.status(200).json({
    //             status : 0,
    //             msg : 'there is no record!'
    //         })
    //     }
    // }).catch(e =>{
    //     res.status(200).json({
    //         status : -1,
    //         msg : "some error in server" + e
    //     })
    // })
})



module.exports = peopleRoutes