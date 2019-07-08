/**
 * this will be used only in programming mode and by the programmer!
 */

var mysql = require('mysql')
var dbconfig = require('./../config/index').database

function initDb(){
    let queryStr = `CREATE DATABASE ${dbconfig.database}`
    con = mysql.createConnection({
        host: dbconfig.host,
        user: dbconfig.user,
        password: dbconfig.password,
    })

    con.connect(function(err){
        if (err) throw err
        con.query(queryStr, function(err, result){
            if (err) throw err

            console.log('successfully database added : ' + JSON.stringify(result))
        })
    })
}

function initTables(queryFunction){
    const usersTableQuery = 
        "CREATE TABLE users ("+
        "id int NOT NULL AUTO_INCREMENT,"+
        "username varchar(255) NOT NULL,"+
        "password varchar(255) NOT NULL,"+
        "primary key (id));"

    const accessTokensTableQuery =
        "CREATE TABLE access_tokens (" +
        "user_id int NOT NULL UNIQUE," +
        "access_token varchar(255) NOT NULL," +
        "access_token_expire varchar(255) NOT NULL," +
        "client_id varchar(255) NOT NULL," +
        "scope varchar(255));"

    const usersTableInitDataQuery = 
        "INSERT INTO users (username, password) VALUES ('root', SHA('123'))"

    queryFunction(usersTableQuery, undefined, true)
    queryFunction(accessTokensTableQuery, undefined, true)
    queryFunction(usersTableInitDataQuery)
}

module.exports = {
    initDb,
    initTables
}
