var JSU = require('./../utility/javaScriptFunctions')

//an instance of model
class Model {
    static get types(){
        return {
            int : "int",
            varchar : "varchar(255)"
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
}

module.exports = Model