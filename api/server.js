'use strict';
/* globals process, __dirname */

require('babel-core/register');
require('babel-polyfill');

const host = process.env.HOST || 'psd.dev.gumgum.com'; // Defaults
//const port = process.env.PORT || 3001;
const port = 3001;
const env = process.env.NODE_ENV || 'development';
const express = require('express'); // Requires
const busboy = require('connect-busboy');
const https = require('https');
const bodyParser = require('body-parser');
const app = exports.app = express();
const router = express.Router();
const pug = require('pug');
const handleErrors = require('./helpers/handle-errors');
const fs = require('fs');
const filePathExists = require('./helpers/file-exists').default;
const tmpDir = './tmp';

filePathExists(tmpDir)
    .then(exists => {
        if (!exists) {
            //process.umask turns 777 into 755
            //http://stackoverflow.com/a/34721366/1335287
            fs.mkdir(tmpDir, (err) => {
                if (err) return console.error(err);
            });
        }
    })
    .catch(err => console.error(err));

// Set up mailer module
app.set('HOST', host);
app.set('ENV', env);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// to support JSON-encoded bodies
app.use(bodyParser.json());
// Middleware - HTTP Data
app.use(busboy());
// CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, authorization');
    next();
});

// Set up Routes
require('./routes')(router, app); // pass our router into our routes

app.use('/api', router);

// Catch and log 500 errors
app.use(handleErrors);
app.listen(port);
