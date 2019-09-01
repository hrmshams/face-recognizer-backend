var express = require('express')
var userRoutes = express()
var userScopeAuthMiddleware = require('./../middlewares/authMiddlewares').userScopeAuthMiddleware

const multer = require('multer');
const upload = multer({dest: __dirname + '/uploads'});


userRoutes.post('/upload', userScopeAuthMiddleware, 
upload.single('photo'), 
(req, res)=>{
     if(req.file) {
          res.json(req.file);
     }
     else {
          res.json({status : -1, msg : "couldn't upload file"})
     }
})

module.exports = userRoutes