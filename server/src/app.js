require('dotenv').config();
const config = require('./config');
const http = require('http');
const https = require("https");
const { join } = require('path');
const fs = require('fs');
const express = require('express');
const socketIO = require('socket.io');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dbConnection = require('./database/dbConnection');
const router = require('./router');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const {ioHandler, adminIoHandler} = require('./io');
const { verifyToken, findUserById } = require('./utils');
const cors = require('cors');
const options = {
  key: fs.readFileSync(config.ssl_key),
  cert: fs.readFileSync(config.ssl_cert)
};

const app = express();
const server = https.createServer(options, app);
const io = socketIO(server);
const initRooms = require('./utils/room/initRooms')
const fileUpload = require('express-fileupload');
const cookie = require('cookie');
const createAdminUser = require('./utils/user/createAdminUser');
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
const rateLimiter = new RateLimiterMemory({
    points: 6,
    duration: 1,
});
io.use(async (socket, next) => {
    try {
        // const token = (socket.request.headers.cookie + ';').match(/(?<=token=)(.*?)(?=;)/)[0];
        console.log('socket connect')
        await rateLimiter.consume(socket.handshake.address)
        const cookies = cookie.parse(socket.request.headers.cookie || '');
        const token = (cookies&&cookies.token)?cookies.token:'ok';
        // const token = cookies.token
        const decoded = await verifyToken(token);
        // eslint-disable-next-line no-param-reassign
        socket.decoded = decoded;
        socket.join(decoded._id);
        next();
    } catch (err) {
        console.log(err)
        next(new Error('Authentication error'));
    }
}).on('connection', ioHandler(io));


// io.of('/admin').use(async (socket, next) => {
//     const cookies = cookie.parse(socket.request.headers.cookie || '');
//     const token = (cookies&&cookies.token)?cookies.token:'ok';
//     const decoded = await verifyToken(token);
//     const user = await findUserById(decoded._id);
//     if(user.role === 'admin') {
//         next();
//     } else {
//         next(new Error('forbidden'));
//     }
// }).on('connection', adminIoHandler(io));

createAdminUser({username: 'rafa', email: 'rafa@gmail.com',password: '12345678', gender: 'male'});
let listeners = app.listeners('');
// io.removeAllListeners('request');
// io.use(async (err, req, res, next) => {
//     console.log('mid')
//     if(req.socket)
//     console.log('ip',req.connection.remoteAddress);
//     res.statusCode = 429;
//     res.end('Too many requst');
// })

// listeners.map((listener) => {
    
//     app.on('request', listener);
// })
// let newlisteners = server.listeners('request');
console.log(listeners)



module.exports = { server, app, dbConnection };
