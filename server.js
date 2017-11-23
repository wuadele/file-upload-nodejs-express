const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const config = require('./config/config.js')

const app = express()
app.use(bodyParser.json())
app.use(cors())

require('./config/database.js');
require('./controllers/routes.js')(app);

var port = config.server.port;

app.listen(port, function() {
    console.log("Server start on port " + port);
});