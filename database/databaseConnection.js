var mysql = require('mysql')
var migrations = require('./migrations')
var dbconfig = require('../config/index').database

class DatabaseConnection {
    static initConnection(){
        let con = mysql.createConnection({
            host: dbconfig.host,
            user: dbconfig.user,
            password: dbconfig.password,
            database: dbconfig.database
        });

        return con
    }
    
    static query(queryStr, callback, notEndConnection){
        let con = DatabaseConnection.initConnection()
        con.connect()
        con.query(queryStr, function(err, result, fields){
            if (err){
                console.log('error happened : '+ JSON.stringify(err))
            } else {
                console.log('successfully query executed, result: ' + result )
            }
            if (!notEndConnection)
                con.end()
        
            if (callback !== undefined)
                callback(err, result)
        })
    }
    
    static migrate(){
        // migrations.initDb()
        migrations.initTables(this.query)
    }    
}

module.exports = DatabaseConnection