var express = require('express')
var normalRoutes = express()

normalRoutes.get('/', (req, res)=>{
    res.send('/ route without auth')
})

normalRoutes.get('/home', (req, res)=>{
    res.send('/home route without auth')
})



module.exports = normalRoutes