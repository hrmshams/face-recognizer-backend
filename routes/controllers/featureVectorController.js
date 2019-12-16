var express = require("express")
var featureBorderRoutes = express()
var adminScopeAuthMiddleware = require("./../middlewares/authMiddlewares")
    .adminScopeAuthMiddleware
var luaPath = require("./../../image_processing_core/batch-represent/src/path")

var people = new (require("../../database/models/people"))()
var status = new (require("../../database/models/status"))()

var fs = require("fs")
const { spawn } = require("child_process")

/***************************************/

featureBorderRoutes.post("/create", adminScopeAuthMiddleware, (req, res) => {
    console.log("create vector")
    try {
        fs.unlinkSync(luaPath() + "/../data/cache.t7")
        console.log("cache.t7 is deleted succeesfully")
    } catch (exception) {
        console.log(exception)
    }

    const luajit = spawn("luajit", [luaPath() + "/main.lua"])
    res.status(200).json({
        status: 1,
        msg: "lua script successfully is running!"
    })

    status.update("is_creating_vectors=0", "is_creating_vectors=1")

    luajit.stdout.on("data", data => {
        console.log(`stdout: ${data}`)
    })

    luajit.stderr.on("data", data => {
        console.error(`stderr: ${data}`)
    })

    luajit.on("close", code => {
        status.update("is_creating_vectors=1", "is_creating_vectors=0")
        status.setDate()
        console.log(`child process exited with code ${code}`)
    })
})

featureBorderRoutes.get(
    "/getReadyPeople",
    adminScopeAuthMiddleware,
    (req, res) => {
        people
            .getReadyPeople()
            .then(r => {
                res.status(200).json({
                    status: 1,
                    readyPeople: r
                })
            })
            .catch(e => {
                res.status(500).json({
                    status: -1,
                    msg: "no ready people"
                })
            })
    }
)

featureBorderRoutes.get("/getInfo", adminScopeAuthMiddleware, (req, res) => {
    status
        .all()
        .then(r => {
            res.status(200).json({
                status: 1,
                is_creating_vectors: r[0].is_creating_vectors,
                last_vector_date: r[0].last_vector_date
            })
        })
        .catch(err => {
            res.status(500).json({
                status: -1,
                msg: "some error in getting information" + err
            })
        })
})

module.exports = featureBorderRoutes
