import io from 'socket.io-client';
import config from '../config'
const socket = io(`${config.server_url}`,{
    autoConnect: false,
});

const mediaSocket = io(`${config.media_server_url}`,{
    autoConnect: false,
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

export { socket, mediaSocket };