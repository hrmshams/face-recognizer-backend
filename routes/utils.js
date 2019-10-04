var fs = require("fs")

function fileExist(filePath) {
    return new Promise((resolve, reject) => {
        fs.access(filePath, fs.F_OK, err => {
            if (err) {
                resolve(err)
            }
            //file exists
            resolve(1)
        })
    })
}

module.exports = fileExist
