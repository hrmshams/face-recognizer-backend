// private functions

// class
class JavaScriptUtilities {
    static copyObject(obj) {
        let newObj = {}
        for (let key in obj){
            newObj[key] = obj[key]
        }
        return newObj
    }

    static copyArray(arr) {
        let newArr = []
        for (let a in arr){
            newArr.push(arr[a])
        }
        return newArr
    }

    static removeFromArray(arr, val){
        console.log ('remove from array : ' + JSON.stringify(arr) + " - " + val)
        for( var i = 0; i < arr.length; i++){ 
            if ( arr[i] === val) {
                arr.splice(i, 1);
            }
        }
        return arr
    }
    
}

module.exports = JavaScriptUtilities