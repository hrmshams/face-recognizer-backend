var JSU = require('./../../utility/javaScriptFunctions')

var sqlWrapper = require('./../sqlWrapper')
var DatabaseConnection = require('./../databaseConnection')

//an instance of model
class Model {
    static get types(){
        return {
            int : "int",
            varchar : "varchar(255)",
            bool : "bool"
        }
    } 
    static get properties() {
        return {
            notNull : "NOT NULL",
            autoIncrement : "AUTO_INCREMENT",
            unique : "UNIQUE",
        }
    }

    constructor(tableName){
        this.tableName = tableName
        this.model = null //this is an object 

        this.values = null
        this.key = null
        this.keyIndex = -1
    }

    // sets
    setModel(){}
    setValues(valuesArray){
        this.values = valuesArray
    }

    // gets
    getData(withoutKey){
        let tableName = this.tableName
        let fields = this.getKeys(this.model, withoutKey)
        let values = this.getValues(withoutKey)
        return {tableName, fields, values}
    }

    getValues(withoutKey){
        if (!withoutKey){
            return this.values
        }
        
        // cloning the object
        let coppiedVals = JSU.copyArray(this.values)
        coppiedVals.splice(this.keyIndex, 1)

        return coppiedVals
    }
    getKeys(model, withoutKey){
        var keys = [];
        for(var key in model){
            if (!model[key].includes(Model.properties.autoIncrement))
                if (!withoutKey)
                    keys.push(key);
                else {
                    if (key !== this.key){
                        keys.push(key)
                    }
                }
        }
        return keys;
    }

    /* database methods */
    save(on_duplicate){
        let self = this
        return new Promise(function (resolve, reject){
            if (!self.values){
                reject('no value has been set for inserting!')
            }
            const insertQuery = sqlWrapper.insertQueryMaker(self, on_duplicate)
            DatabaseConnection.query(insertQuery)
            .then(res=>{
              resolve(res)
            })
            .catch(err=>{
              reject(err)
            })
        })

    }

    all(){
        const getAllRecordsQuery = sqlWrapper.selectQueryMaker("*", this.tableName)
        
        console.log(getAllRecordsQuery)

        return new Promise(function(resolve, reject){
            DatabaseConnection.query(getAllRecordsQuery)
            .then(res=>{
                resolve(res)
            })
            .catch(err=>{
                reject(err)
            })    
        })
    }

    where(condition, coloums){
        // todo columns
        const getUserIDQuery = sqlWrapper.selectQueryMaker("*", this.tableName, condition)
        return new Promise(function(resolve, reject){
            DatabaseConnection.query(getUserIDQuery)
            .then(res=>{
                resolve(res)
            })
            .catch(err=>{
                reject(err)
            })
        })

    }

    update(condition, new_values){
        let query = `UPDATE ${this.tableName} SET ${new_values} WHERE ${condition};`
        console.log(query)
        return new Promise(function(resolve, reject){
            DatabaseConnection.query(query)
            .then(res=>{
                resolve(res)
            })
            .catch(err=>{
                reject(err)
            })
        })        
    }

}

module.exports = Model