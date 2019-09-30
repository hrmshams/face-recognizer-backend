var express = require("express")
var faceDetectRoutes = express()

var userScopeAuthMiddleware = require("./../middlewares/authMiddlewares")
    .userScopeAuthMiddleware

const multer = require("multer")
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads")
    },
    filename: function(req, file, cb) {
        const name = req.appendedToken.user.username + ".jpg"
        cb(null, name)
    }
})

/** related to crawling python script **/
var pythonAddress = require("./../../image_processing_core/addGetter")
var preProcessPythonScript = pythonAddress() + "/classifier.py"
var { PythonShell } = require("python-shell")

let uploadDirGetter = require("./../../uploads/uploadDirGetter")

/***************************************/

const upload = multer({ storage })
var upload_status = new (require("../../database/models/upload_status"))()

faceDetectRoutes.post(
    "/upload",
    userScopeAuthMiddleware,
    (req, res, next) => {
        const user_id = req.appendedToken.user.id
        upload_status
            .update(`user_id=${user_id}`, "status='uploading'")
            .then(res => {
                next()
            })
            .catch(err => {
                res.json({
                    status: -1,
                    msg: "couldn't change the upload status!"
                })
            })
    },
    upload.single("file"),
    (req, res) => {
        const user_id = req.appendedToken.user.id
        if (req.file) {
            upload_status
                .update(`user_id=${user_id}`, "status='processing'")
                .then(r => {
                    res.json({
                        status: 1,
                        details: req.file
                    })
                })
                .catch(err => {
                    res.json({
                        status: -1,
                        msg:
                            "couldn't change the upload status to processing! : " +
                            err
                    })
                })
        } else {
            res.json({ status: -1, msg: "couldn't upload file" })
        }
    }
)

faceDetectRoutes.post("/start", userScopeAuthMiddleware, (req, res) => {
    const username = req.appendedToken.user.username
    const user_id = req.appendedToken.user.id

    let imgAdd =
        uploadDirGetter() + "/" + req.appendedToken.user.username + ".jpg"

    console.log(imgAdd)

    let options = {
        pythonPath: "/usr/bin/python3.6",
        args: ["infer", imgAdd]
    }

    var pyshell = new PythonShell(preProcessPythonScript, options)
    pyshell.on("message", function(message) {
        msg = message.split("__")
        if (msg[1] === "d-prsn" && msg[3] === "d-conf") {
            upload_status.update(
                `user_id='${user_id}'`,
                `p_person='${msg[2]}', confidence='${msg[4]}'`
            )
        }
        console.log(msg)
    })

    // end the input stream and allow the process to exit
    pyshell.end(function(err) {
        if (err) {
            console.log(err)
        }
        console.log("python preprocessing script finished")
        upload_status
            .update(`user_id=${user_id}`, "status='done'")
            .then(res => {
                console.log("successfully changes the upload_status : ", res)
            })
            .catch(err => {
                console.log("couldn't change the uplaod_status : ", err)
            })
    })
    res.json({
        status: 1,
        msg:
            "running the classifier for detection script is successfully started"
    })
})

faceDetectRoutes.get(
    "/getComparingProcessInfo",
    userScopeAuthMiddleware,
    (req, res) => {
        const username = req.appendedToken.user.username
        const user_id = req.appendedToken.user.id

        upload_status
            .where(`user_id='${user_id}'`)
            .then(r => {
                res.status(200).json(r[0])
                console.log(r)
            })
            .catch(err => {
                console.log(err)
            })
    }
)

module.exports = faceDetectRoutes
