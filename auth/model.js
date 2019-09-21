var AccessTokenModel = require('./../database/models/accessTokens')
var Users = require('./../database/models/users')

var config = {
	clients: [{
		id: 'application',	// TODO: Needed by refresh_token grant, because there is a bug at line 103 in https://github.com/oauthjs/node-oauth2-server/blob/v3.0.1/lib/grant-types/refresh-token-grant-type.js (used client.id instead of client.clientId)
		clientId: 'application',
		clientSecret: 'secret',
		grants: [
			'password',
		],
		redirectUris: []
	}],
	valid_scopes: ['user', 'admin']
};

module.exports = () => {
	return ({
		getAccessToken,
		getClient,
		saveToken,
		getUser,
		validateScope,
		verifyScope
	})
};

/*
 * Methods used by all grant types.
 */

var getAccessToken = function(bearerToken, callback) {

	// console.log('getaccessToken called bearer token : ' + bearerToken)
	let accessTokenModel = new AccessTokenModel()
	accessTokenModel.where(`access_token='${bearerToken}'`)
	.then(res=>{
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
			// let tokenObj = {
			// 	accessToken: null,
			// 	accessTokenExpiresAt: new Date(),
			// 	scope: -1,
			// 	client: {
			// 		id: null
			// 	},
			// 	user: {
			// 		id : null
			// 	}			
			// }
			callback(false, null)
		}
  
	}).catch(err=>{
	  console.log('err' + err)
	  callback(true, null)
	})
};

var getClient = function(clientId, clientSecret) {

	// console.log('getClient() called')
	var clients = config.clients.filter(function(client) {

		return client.clientId === clientId && client.clientSecret === clientSecret;
	});

	return clients[0];
};

var saveToken = function(token, client, user) {

	// console.log('saveAccessToken() called and accessToken is: ', token,' and client is: ',client, ' and user is: ', user)
  
	//save the accessToken along with the user.id
	let accessTokenModel = new AccessTokenModel()
	accessTokenModel.setValues([
		user.id, 
		token.accessToken, 
		token.accessTokenExpiresAt, 
		token.clientId, 
		token.scope
	])
	accessTokenModel.save(true)
	.then(res=>{
		// console.log('successfully query executed , res : ' + res)
	})
	.catch(err=>{
		console.log('error happened in query execution , err : ' + err)
	})
  
	return {
		accessToken : token.accessToken,
		accessTokenExpiresAt : token.accessTokenExpiresAt,
		client : {
			id : client.clientId
		},
		user : {
			id : user.id,
		},
		scope : token.scope
	}
};

/*
 * Method used only by password grant type.
 */

var getUser = function(username, password, callback) {
	// console.log('getUser() called and username is :'+ username + ' and password is :'+ password);

	//try and get the user using the user's credentials
	let users = new Users()
	users.where(`username = '${username}' AND password = SHA('${password}')`)
	.then(res=>{
		// console.log('successfully got the user ', res)
		callback(false, res !== null && res.length  === 1 ?  res[0] : null)
  
	}).catch(err=>{
		console.log('error in getUserFromCrentials : ', err)
		callback(true, null)
	})
  
};

function validateScope(user, client, scope) {
	// console.log('validateScope() called and requested scope in validate : ' + scope)
	if (!scope){
		return false
	}


	if (!scope.split(' ').every(s => config.valid_scopes.indexOf(s) >= 0)) {
		return false;
	}
	return scope;
}

function verifyScope(token, scope) {
	// console.log('verifyScope() called token : ' + JSON.stringify(token))
	if (!token.scope || !scope) {
		return false;
	}

	let requestedScopes = scope.split(' ');
	let authorizedScopes = token.scope.split(' ');
	var result = requestedScopes.every(s => authorizedScopes.indexOf(s) >= 0)

	// console.log('requested scope : ' + scope + " - and the result : " + result)
	return result;
}

/**
 * Export model definition object.
 */

