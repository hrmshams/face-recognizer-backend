var express = require('express')
var userRoutes = express()
var userScopeAuthMiddleware = require('./../middlewares/authMiddlewares').userScopeAuthMiddleware
var adminScopeAuthMiddleware = require('./../middlewares/authMiddlewares').adminScopeAuthMiddleware

const multer = require('multer');
const upload = multer({dest: __dirname + '/uploads'});
var users = new (require('../../database/models/users'))()
var accessTokens = new (require('../../database/models/accessTokens'))()

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

userRoutes.post('/deleteUser', adminScopeAuthMiddleware, (req, res)=>{
  let {id} = req.body
  let deleteUser = users.deleteUser(id)
  let deleteAccessToken = accessTokens.deleteAccessToken(id)

  Promise.all([deleteUser, deleteAccessToken]).then(function(vals){
    res.status(200).json({
      userDeleted: vals[0].affectedRows,
      accessTokenDeleted: vals[1].affectedRows
    })
  }).catch(err=>{
    res.status(500).json({
      msg : 'error in getting users' + err
    })
  })
})

userRoutes.post('/promoteDemote', adminScopeAuthMiddleware, (req, res)=>{
  let {id, isPromote} = req.body
  console.log(isPromote)
  users.promoteDemote(id, isPromote).then(r=>{
    if (r.affectedRows === 1){
      res.status(200).json({
        status : 1,
        user_id : id,
        msg : 'successfully ' + isPromote,
        isPromote
      })
    }else{
      res.status(200).json({
        status : 0,
        user_id : id,
        msg : 'no such user_id : ' + id
      })      
    }
  }).catch(err=>{
    res.status(500).json({
      status : -1,
      msg : "couldn't promte " + err 
    })
    console.log(err)
  })
})


module.exports = userRoutes