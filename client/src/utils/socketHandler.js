import io from 'socket.io-client';
import config from '../config'

let token = window.localStorage.getItem('token');

let socket = io(`${config.server_url}`,{
    autoConnect: false,
    transport: ['polling', 'websocket'],
    timeout: 60000,
    pingTimeout: 60000,
    secure: true,
    reconnectionDelay: 1000,
    extraHeaders: {
        token
    }
});

const createNewSocket = (token) => {
    if(socket) {
        socket.removeAllListeners();
        socket.close();
    }
    socket = io(`${config.server_url}`,{
        autoConnect: false,
        transport: ['polling', 'websocket'],
        timeout: 60000,
        pingTimeout: 60000,
        secure: true,
        reconnectionDelay: 1000,
        extraHeaders: {
            token
        },
    });
    return;
}

const mediaSocket = io(`${config.media_server_url}`,{
    autoConnect: false,
    withCredentials: true,
    extraHeaders: {
        "my-custom-header": "abcd"
    },
    transport: ['polling', 'websocket'],
    timeout: 60000,
    pingTimeout: 60000,
    secure: true,
    reconnectionDelay: 1000
});


socket.request = function request(type, data = {}) {
    return new Promise((resolve, reject) => {
        socket.emit(type, data, (data) => {
        if (data.error) {
            reject(data.error)
        } else {
            resolve(data)
        }
        })
    })
}

mediaSocket.request = function request(type, data = {}) {
    return new Promise((resolve, reject) => {
        mediaSocket.emit(type, data, (data) => {
        if (data.error) {
            reject(data.error)
        } else {
            resolve(data)
        }
        })
    })
}

export { socket, mediaSocket, createNewSocket };