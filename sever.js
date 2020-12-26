const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const http = require('http');
const container = require('./container');
const users = require('./controllers/users');
const color = require('colors')
const cookieParser = require('cookie-parser');
const validator = require ('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport')




container.resolve(function (users) {

    mongoose.Promise = global.Promise;
    mongoose.connect(`${process.env.MONGO_URI}`,{
       useMongoClient: true,
       useNewUrlParser: true
    });
    //console.log(`MongoDb Connected:${connect.connection.host}`.green.underline);

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
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(cookieParser());
        //app.use(validator());
        app.use(session({
            secret: 'asdkljjhhhjkkknk',
            resave: true,
            saveInitialized: true,
            stroe: new MongoStore({
                mongooseConnection: mongoose.connection
            })
        }))
        app.use(flash())

        app.use(passport.initialize());
        app.use(passport.session());
    }
});

