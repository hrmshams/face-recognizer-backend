var express = require('express')
var preprocessRoutes = express()
var adminScopeAuthMiddleware = require('./../middlewares/authMiddlewares').adminScopeAuthMiddleware
var pythonAddress = require('./../../image_processing_core/addGetter')

var people = new (require('../../database/models/people'))()
var status = new (require('../../database/models/status'))()

/** related to crawling python script **/
var preProcessPythonScript = pythonAddress() + '/preprocess.py';
var {PythonShell} = require('python-shell');

let options = {
    pythonPath : "/usr/bin/python3.6",
};
/***************************************/

preprocessRoutes.post('/start', adminScopeAuthMiddleware, (req, res)=>{
  var pyshell = new PythonShell(preProcessPythonScript, options);
  pyshell.on('message', function (message) {
    console.log(message)
  });

  // end the input stream and allow the process to exit
  pyshell.end(function (err) {
      if (err){
          throw err;
      };
      console.log('python preprocessing script finished');
      status.update('is_preprocessing=1', 'is_preprocessing=0').then(res=>{
          console.log('successfully changes the status : ', res)
      }).catch(err=>{
          console.log('couldnt change the status : ', err)
      })
  });
  res.json({
      status : 1,
      msg : 'running the preprocessing script is successfully started'
  })

})

preprocessRoutes.get('/getPeoplePreprocess', adminScopeAuthMiddleware, (req, res)=>{
    let p_preprocessed = people.getUnpreprocessPeople(0)
    let is_preprocessing = status.all()

    Promise.all([p_preprocessed, is_preprocessing]).then(function(vals){
        if (vals && (vals[0].length>0 || vals[1].length>0)){
            res.status(200).json({
                status : 1,
                not_preprocessed : vals[0],
                is_preprocessing : vals[1][0].is_preprocessing
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
})

module.exports = preprocessRoutes