require('dotenv').config();

const http = require('http');
const https = require("https");
const { join } = require('path');
const fs = require('fs');
const express = require('express');
const socketIO = require('socket.io');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');

const config = require('./config');

const dbConnection = require('./database/dbConnection');
const router = require('./router');
const ioHandler = require('./io');
const { verifyToken } = require('./utils');
const cors = require('cors');
const options = {
  key: fs.readFileSync(config.ssl_key),
  cert: fs.readFileSync(config.ssl_cert)
};
console.log(process.env.SECRET_KEY);

const app = express();
const serverHttp = http.createServer(app);
const server = https.createServer(options, app);

const io = socketIO(server);
const initRooms = require('./utils/room/initRooms')
const fileUpload = require('express-fileupload');
initRooms();
app.disabled('x-powered-by');
// app.enable('trust proxy');
app.use(cookieParser());
app.use(compression());

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(fileUpload({limits: {fileSize: 50 * 1024 * 1024, preserveExtension: true}}));
app.use(cors());

app.use('/api', router);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(join(__dirname, '..', '..', 'client', 'build')));
    app.all('*', (req, res) =>
        res.sendFile(join(__dirname, '..', '..', 'client', 'build', 'index.html'))
    );
}

io.use(async (socket, next) => {
    const token = (socket.request.headers.cookie + ';').match(/(?<=token=)(.*?)(?=;)/)[0];

    try {
        const decoded = await verifyToken(token);
        // eslint-disable-next-line no-param-reassign
        socket.decoded = decoded;
        console.log('decoded', decoded);
        socket.join(decoded._id);
        console.log(decoded._id, await io.in(decoded._id).allSockets())
        next();
    } catch (err) {
        console.log(err)
        next(new Error('Authentication error'));
    }
}).on('connection', ioHandler(io));

module.exports = { server, app, dbConnection };
