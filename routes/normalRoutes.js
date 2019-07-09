var express = require('express')
var normalRoutes = express()

normalRoutes.get('/', (req, res)=>{
	res.status(200).json({res : '/user route allowed'})
})

normalRoutes.get('/:name', (req, res)=>{
    console.log(req.query)
    res.send(` route without auth`)
})

module.exports = normalRoutes