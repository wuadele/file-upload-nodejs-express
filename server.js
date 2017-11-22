const express = require('express')
const app = express()
const config = require('./config/config.js')

require('./config/database.js');
require('./controllers/routes.js')(app);

var port = config.server.port;

app.listen(port, function() {
    console.log("Server start on port " + port);
});