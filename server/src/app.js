require('dotenv').config();

const http = require('http');
const https = require("https");
const { join } = require('path');
const fs = require('fs');
const config = require('./config');
const express = require('express');
const socketIO = require('socket.io');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dbConnection = require('./database/dbConnection');
const router = require('./router');
const {ioHandler, adminIoHandler, initIO} = require('./io');
const bootManager = require('./constructors/bootManager');
const { verifyToken, findUserById, createAdminUser, initSetting } = require('./utils');
const cors = require('cors');
const options = {
  key: fs.readFileSync(config.ssl_key),
  cert: fs.readFileSync(config.ssl_cert)
};

const app = express();
const server = https.createServer(options, app);
initIO(server);
const initRooms = require('./utils/room/initRooms')
const {initMediasoup} = require('./media');
const fileUpload = require('express-fileupload');
const cookie = require('cookie');
initRooms();
bootManager.init();
app.use(cookieParser());
app.use(compression());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(fileUpload({limits: {fileSize: 50 * 1024 * 1024, preserveExtension: true}}));
app.use(cors());
app.use('/api', router);

if (process.env.NODE_ENV === 'production') {
    app.use('/admin', express.static(join(__dirname, '..', '..', 'admin', 'build')));
    app.use(express.static(join(__dirname, '..', '..', 'client', 'build')));
    app.get('admin/*', (req, res) =>
        res.sendFile(join(__dirname, '..', '..', 'admin', 'build', 'index.html'))
    );
    app.get('*', (req, res) =>
        res.sendFile(join(__dirname, '..', '..', 'client', 'build', 'index.html'))
    );
}

createAdminUser({username: 'rafa', email: 'rafa@gmail.com',password: '12345678', gender: 'male'});
initSetting();

module.exports = { server, app, dbConnection };
