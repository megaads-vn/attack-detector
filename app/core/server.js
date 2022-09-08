var express = require('express');

const routeApi = require(__dir + '/app/http/router/api');
const routeWeb = require(__dir + '/app/http/router/web');

var app = express();
app.use('/api', routeApi);
app.use('/', routeWeb);
app.listen(8792, function () {
    console.log("Attack detector listening on address http://127.0.0.1:8792")
});

module.exports = app;