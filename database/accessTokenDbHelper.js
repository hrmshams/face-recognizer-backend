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
  console.log ('query : \n' + getUserQuery)  
  // we just save two values of token! 
  // const getUserQuery =  `INSERT INTO access_tokens (user_id, access_token, access_token_expire, client_id, scope) VALUES ("${userID}", "${token.accessToken}", ${JSON.stringify(token.accessTokenExpiresAt)}, "${token.clientId}", "${token.scope}")` +
  // ` ON DUPLICATE KEY UPDATE access_token="${token.accessToken}", access_token_expire=${JSON.stringify(token.accessTokenExpiresAt)}, client_id="${clientID}", scope="${token.scope}";`


  //execute the query to get the user
  DatabaseConnection.query(getUserQuery, (err, result) => {
      //pass in the error which may be null and pass the results object which we get the user from if it is not null
      if (callback)
        callback(err, result)
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

  //create query to get the userID from the row which has the bearerToken
  const getUserIDQuery = sqlWrapper.selectQueryMaker("*", "access_tokens", `access_token='${bearerToken}'`)

  //execute the query to get the userID
  DatabaseConnection.query(getUserIDQuery, (err, result) => {

    console.log('error in get user id from bearer token: ', err + 'results', result)

      //get the userID from the results if its available else assign null
      let tokenObj = null

      if (result && result.length){
        const token = result[0]
        tokenObj = {
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
      }

      callback(tokenObj)
  })
}
