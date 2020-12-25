const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const http = require('http');
const container = require('./container');
const users = require('./controllers/users');
const color = require('colors')

container.resolve(function (users) {
    const app = SetupExpress();

    function SetupExpress() {
        const app = express();
        const PORT = process.env.PORT || 5000
        const server = http.createServer(app)
        server.listen(PORT, function () {
            console.log(`listening on port ${PORT}`.green.inverse)
        });
        ConfigureExpress(app)
        const router = require('express-promise-router')();
        users.SetRouting(router)
        app.use(router)
    }

    function ConfigureExpress(app){
        app.use(express.static('public'));
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}))
    }
});

