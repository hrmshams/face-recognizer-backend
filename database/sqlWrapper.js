const createTableQueryMaker = function(){
}

const insertQueryMaker = function(model, onDuplicate){

    let onDuplicateQuery = function(model){
        let {fields, values} = model.getData(true)

        let query = " ON DUPLICATE KEY UPDATE"
        for (let i=0; i<fields.length; i++){
            query += " " + fields[i] + "=" + '"' + values[i] + '"' + ","
        }
        query = query.substring(0, query.length - 1);
        query += ";"

        return query
    }

    let {tableName, fields, values} = model.getData(false)
    let query = "INSERT INTO " + tableName + " ("

    for (let i=0; i<fields.length; i++){
        query += fields[i]
        if (i != fields.length-1)
            query += ", "
    }
    query += ") VALUES ("

    for (let i=0; i<values.length; i++){
        query += '"' + values[i] + '"' + ","
    }
    query = query.substring(0, query.length - 1);
    query += ")"

    if (onDuplicate){
        query += onDuplicateQuery(model)
    } else {
        query += ";"
    }

    return query
}

const selectQueryMaker = function(selectedFields, tableName, conditionStr){
    createSelectedQuery = function(){
        if (selectedFields === "*"){
            return "*"
        }
        var str = "("
        for (let i=0; i<selectedFields.length; i++){
            str += selectedFields[i] 
            if (i != selectedFields.length -1){
                str += ","
            }         
        }
        str += ")"

        return str
    }
    let selectedFieldsStr = createSelectedQuery(selectedFields)
    let query = "SELECT " + selectedFieldsStr + " FROM " + tableName + " WHERE " + conditionStr

    return query
}

module.exports = {
    selectQueryMaker,
    insertQueryMaker
}