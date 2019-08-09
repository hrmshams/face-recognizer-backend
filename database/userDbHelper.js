var DatabaseConnection = require('./databaseConnection')
module.exports = () => {
  return {
   registerUserInDB: registerUserInDB,
   getUserFromCrentials: getUserFromCrentials,
   doesUserExist: doesUserExist
  }
}

function registerUserInDB(username, password, registrationCallback){

  //create query using the data in the req.body to register the user in the db
  const registerUserQuery = `INSERT INTO users (username, password) VALUES ('${username}', SHA('${password}'))`

  //execute the query to register the user
  DatabaseConnection.query(registerUserQuery, registrationCallback)
}


function getUserFromCrentials(username, password, callback) {

  const getUserQuery = `SELECT * FROM users WHERE username = '${username}' AND password = SHA('${password}')`
  console.log('getUserFromCrentials query is: ', getUserQuery);

  DatabaseConnection.query(getUserQuery).then(res=>{
    console.log('successfully got the user ', res)
    callback(false, res !== null && res.length  === 1 ?  res[0] : null)

  }).catch(err=>{
    console.log('error in getUserFromCrentials : ', err)
    callback(true, null)
  })

  // DatabaseConnection.query(getUserQuery, (err, result) => {
  //     //pass in the error which may be null and pass the results object which we get the user from if it is not null
  //     console.log('error is : ' + err)
  //     console.log('result is : ' + result)

  //     callback(false, result !== null && result.length  === 1 ?  result[0] : null)
  // })
}


function doesUserExist(username, callback) {
  const doesUserExistQuery = `SELECT * FROM users WHERE username = '${username}'`

  const sqlCallback = (dataResponseObject) => {

      const doesUserExist = dataResponseObject.results !== null ? dataResponseObject.results.length > 0 ? true : false : null
      callback(dataResponseObject.error, doesUserExist)
  }

  DatabaseConnection.query(doesUserExistQuery, sqlCallback)
}
