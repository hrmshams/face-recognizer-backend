var express = require('express')
var userRoutes = express()
var userScopeAuthMiddleware = require('./../middlewares/authMiddlewares').userScopeAuthMiddleware
var adminScopeAuthMiddleware = require('./../middlewares/authMiddlewares').adminScopeAuthMiddleware

const multer = require('multer');
const upload = multer({dest: __dirname + '/uploads'});
var users = new (require('../../database/models/users'))()

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

userRoutes.get('/getAll', adminScopeAuthMiddleware, (req, res)=>{
  users.getAll().then(r=>{
    res.status(200).json(r)
  }).catch(err=>{
    res.status(500).json({
      msg : 'error in getting users' + err
    })
  })
})


module.exports = userRoutes