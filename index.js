var app = require('express')(),
    config = require('./config/index'),
    bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// database.migrate()
var auth = require('./auth/index')(app)
var routes = require('./routes/index.js')(app, auth)
routes.configRoutes()


app.listen(config.port, ()=>{
    console.log(`server is running on port ${config.port}`)
})
