var express = require('express')
var peopleRoutes = express()
var adminScopeAuthMiddleware = require('./../middlewares/authMiddlewares').adminScopeAuthMiddleware

var people = new (require('../../database/models/people'))()

peopleRoutes.post('/addPersonForCrowl', adminScopeAuthMiddleware, (req, res)=>{
    let {name} = req.body

    res.end('asd')
    // people.setValues([
    //     name,
    //     false
    // ])
    // people.save().then(r=>{
    //     res.status(200).json({
    //         res : 1,
    //         msg : "person successfully added!"
    //     })
    // }).catch(e=>{
    //     res.status(500).json({
    //         res : -1,
    //         msg : "error happened in adding person!" + e
    //     })
    // })
})

module.exports = peopleRoutes