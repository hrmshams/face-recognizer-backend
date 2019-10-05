var express = require("express")
var trainRoutes = express()
var adminScopeAuthMiddleware = require("./../middlewares/authMiddlewares")
    .adminScopeAuthMiddleware

var status = new (require("../../database/models/status"))()
var pythonAddress = require("./../../image_processing_core/addGetter")

/** related to crawling python script **/
var preProcessPythonScript = pythonAddress() + "/classifier.py"
var { PythonShell } = require("python-shell")

let options = {
    pythonPath: "/usr/bin/python3.6",
    args: ["train"]
}

/***************************************/

trainRoutes.post("/start", adminScopeAuthMiddleware, (req, res) => {
    status.update("is_training=0", "is_training=1")

    var pyshell = new PythonShell(preProcessPythonScript, options)
    pyshell.on("message", function(message) {
        console.log(message)
    })

    // end the input stream and allow the process to exit
    pyshell.end(function(err) {
        if (err) {
            throw err
        }
        console.log("python training script finished")
        status
            .update("is_training=1", "is_training=0")
            .then(res => {
                console.log("successfully changes the status : ", res)
            })
            .catch(err => {
                console.log("couldnt change the status : ", err)
            })
    })
    res.json({
        status: 1,
        msg: "running the training script is successfully started"
    })
})

trainRoutes.get("/getInfo", adminScopeAuthMiddleware, (req, res) => {
    status
        .all()
        .then(r => {
            res.status(200).json({
                status: 1,
                is_training: r[0].is_training
            })
        })
        .catch(err => {
            res.status(500).json({
                status: -1,
                msg: "some error in getting information" + err
            })
        })
})
const fs = require("fs")
const imageProcessingPath = require("./../../image_processing_core/addGetter")
trainRoutes.post("/setModel", adminScopeAuthMiddleware, (req, res) => {
    const { is_my_model } = req.body

    if (is_my_model == 1) {
        const myModelPath =
            imageProcessingPath() + "/batch-represent/reps/classifier.pkl"

        fs.access(myModelPath, fs.F_OK, err => {
            if (err) {
                console.error(err)

                status
                    .update("id=1", "is_my_model=0")
                    .then(r => {
                        res.json({
                            status: 0,
                            msg: "custom model doesn't exist, changed to 0",
                            is_my_model: 0
                        })
                    })
                    .catch(err => {
                        res.json({
                            status: -1,
                            msg:
                                "custom model doesn't exist and couldn't change : " +
                                err
                        })
                    })

                return
            }

            status
                .update("id=1", `is_my_model=${is_my_model}`)
                .then(r => {
                    res.json({
                        status: 1,
                        is_my_model,
                        msg: "custom model is set"
                    })
                })
                .catch(err => {
                    res.json({
                        status: -1,
                        msg: "couldn't change : " + err
                    })
                })
        })
    } else {
        status
            .update("id=1", `is_my_model=${is_my_model}`)
            .then(r => {
                res.json({
                    status: 1,
                    is_my_model,
                    msg: "pre model is set"
                })
            })
            .catch(err => {
                res.json({
                    status: -1,
                    msg: "couldn't change : " + err
                })
            })
    }
})

trainRoutes.get("/getWholeStatus", adminScopeAuthMiddleware, (req, res) => {
    status
        .all()
        .then(r => {
            res.json({
                status: 1,
                data: { ...r[0] }
            })
        })
        .catch(err => {
            res.json({
                status: -1
            })
        })
})

module.exports = trainRoutes
