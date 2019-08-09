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

let userDBHelper
let accessTokensDBHelper
module.exports = (injectedDBHelpers) => {
	userDBHelper = injectedDBHelpers.userDbHelper
	accessTokensDBHelper = injectedDBHelpers.accessTokenDbHelper
	
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

	console.log('getaccessToken called bearer token : ' + bearerToken)
	accessTokensDBHelper.getUserIDFromBearerToken(bearerToken, callback)


	// return { accessToken: '2444cc3020b11d9d959cb7702345d645d303fad8',
	// accessTokenExpiresAt: new Date('Fri Aug 09 2019 22:57:45 GMT+0430 (Iran Daylight Time)'),
	// scope: 'user',
	// client: { id: 'undefined' },
	// user: { id: 2 } }

};

var getClient = function(clientId, clientSecret) {

	console.log('getClient() called')
	var clients = config.clients.filter(function(client) {

		return client.clientId === clientId && client.clientSecret === clientSecret;
	});

	return clients[0];
};

var saveToken = function(token, client, user) {

	console.log('saveAccessToken() called and accessToken is: ', token,' and client is: ',client, ' and user is: ', user)
  
	//save the accessToken along with the user.id
	accessTokensDBHelper.saveAccessToken(token, client.id, user.id)

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
	console.log('getUser() called and username is :'+ username + ' and password is :'+ password);

	//try and get the user using the user's credentials
	userDBHelper.getUserFromCrentials(username, password, callback)
};

function validateScope(user, client, scope) {
	console.log('validateScope() called and requested scope in validate : ' + scope)
	if (!scope){
		return false
	}


	if (!scope.split(' ').every(s => config.valid_scopes.indexOf(s) >= 0)) {
		return false;
	}
	return scope;
}

function verifyScope(token, scope) {
	console.log('verifyScope() called')
	if (!token.scope || !scope) {
	  return false;
	}

	let requestedScopes = scope.split(' ');
	let authorizedScopes = token.scope.split(' ');
	var result = requestedScopes.every(s => authorizedScopes.indexOf(s) >= 0)

	console.log('requested scope : ' + scope + " - and the result : " + result)
	return result;
}

/**
 * Export model definition object.
 */

