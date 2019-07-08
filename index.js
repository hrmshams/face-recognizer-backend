var app = require('express')(),
    config = require('./config/index'),
    database = require('./database/index')
    bodyParser = require('body-parser')

const accessTokenDbHelper = require('./database/accessTokenDbHelper')(database)
const userDbHelper = require('./database/userDbHelper')(database)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// database.migrate()
var auth = require('./auth/index')(app, {accessTokenDbHelper, userDbHelper})
var routes = require('./routes/index.js')(app, auth)
routes.configRoutes()


app.listen(config.port, ()=>{
    console.log(`server is running on port ${config.port}`)
})