var sqlWrapper = require('./sqlWrapper')
var AccessTokenModel = require('./models/accessTokens')
var DatabaseConnection = require('./databaseConnection')

module.exports = () => {
  return {
    saveAccessToken: saveAccessToken,
    getUserIDFromBearerToken: getUserIDFromBearerToken
  }
}

/**
 * Saves the accessToken against the user with the specified userID
 * It provides the results in a callback which takes 2 parameters:
 *
 * @param accessToken
 * @param userID
 * @param callback - takes either an error or null if we successfully saved the accessToken
 */
function saveAccessToken(token, clientID, userID, callback) {

  let accessTokenModel = new AccessTokenModel()
  accessTokenModel.setValues([
    userID, 
    token.accessToken, 
    token.accessTokenExpiresAt, 
    token.clientId, 
    token.scope
  ])
  const getUserQuery = sqlWrapper.insertQueryMaker(accessTokenModel, true)
  DatabaseConnection.query(getUserQuery)
  .then(res=>{
    console.log('successfully query executed , res : ' + res)
  })
  .catch(err=>{
    console.log('successfully query executed , err : ' + err)
  })
}

/**
 * Retrieves the userID from the row which has the spcecified bearerToken. It passes the userID
 * to the callback if it has been retrieved else it passes null
 *
 * @param bearerToken
 * @param callback - takes the user id we if we got the userID or null to represent an error
 */
function getUserIDFromBearerToken(bearerToken, callback){
  const getUserIDQuery = sqlWrapper.selectQueryMaker("*", "access_tokens", `access_token='${bearerToken}'`)

  // return new Promise(function(resolve, reject){
  //   DatabaseConnection.query(getUserIDQuery, (err, result) => {
  //     console.log('acc2')
  //     if (err){
  //       reject(err)
  //     } else {
  //       resolve(result)
  //     }
  //   })
  // })

  DatabaseConnection.query(getUserIDQuery).then(res=>{
		var tokenObj = null
		if (res && res.length){
			const token = res[0]
			let tokenObj = {
			  accessToken: token.access_token,
			  accessTokenExpiresAt: new Date(token.access_token_expire),
			  scope: token.scope,
			  client: {
				id: token.client_id
			  },
			  user: {
				id : token.user_id
			  }
			}
      callback(false, tokenObj)
    }else{
      callback(true, null)
		}
  }).catch(err=>{
    console.log('err' + err)
    callback(true, null)
  })

}
