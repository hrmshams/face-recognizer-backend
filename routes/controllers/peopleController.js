var express = require('express')
var peopleRoutes = express()
var credintialRoutes = require('./../credintialRoutes')
console.log(credintialRoutes)

var people = new (require('../../database/models/people'))()

// peopleRoutes.post('/addPersonForCrowl', credintialRoutes.adminScopeAuthMiddleware, (req, res)=>{
//     let {name} = req.body

//     people.setValues([
//         name,
//         false
//     ])
//     people.save().then(r=>{
//         res.status(200).json({
//             res : 1,
//             msg : "person successfully added!"
//         })
//     }).catch(e=>{
//         res.status(500).json({
//             res : -1,
//             msg : "error happened in adding person!" + e
//         })
//     })
// })

module.exports = peopleRoutes