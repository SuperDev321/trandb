
const socketWorker = () => {
    /* eslint-disable-next-line no-restricted-globals */
    self.importScripts("https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.1.2/socket.io.js");
    let socket = null;

    const sendMessage = (mName, mData) => {
        postMessage({
            type: 'emit',
            mName,
            mData
        })
    }

    const sendRequest = (mName, mData) => {
        return new Promise((resolve, reject) => {
            const channel = new MessageChannel(); 

            channel.port1.onmessage = ({data}) => {
                channel.port1.close();
                if (data.error) {
                    reject(data.error);
                }else {
                    resolve(data.result);
                }
            };

            postMessage({
                type: 'request',
                mName,
                mData
            }, [channel.port2]);
        })
    }
    
    const createNewSocket = (token, ismobile = false) => {
        if(socket) {
            socket.removeAllListeners();
            socket.close();
        }
        /* eslint-disable-next-line no-restricted-globals */
        socket = self.io('https://192.168.16.129:3000',{
            autoConnect: false,
            transports: ['polling', 'websocket'],
            timeout: 60000,
            pingTimeout: 60000 * 3,
            secure: true,
            reconnectionDelay: 1000,
            query: {
                token,
                ismobile
            },
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

        socket.on('init room', (data, callback) => {
            sendMessage('init room', data);
            callback('success');
        })

        socket.on('room message', (data) => {
            sendMessage('room message', data);
        })

        socket.on('disconnect', (reason) => {
            sendMessage('room message', { reason });
        })

        socket.on('joined room', (data) => {
            sendMessage('joined room', data);
        })

        socket.on('leave room', (data) => {
            sendMessage('leave room', data);
        });

        socket.on('kicked user', (data) => {
            sendMessage('kicked user', data);
        });

        socket.on('banned user', (data) => {
            sendMessage('banned user', data);
        });

        socket.on('global banned user', (data) => {
            sendMessage('global banned user', data);
        });

        socket.on('update block', (data) => {
            sendMessage('update block', data);
        });
        socket.on('update global block', (data) => {
            sendMessage('update global block', data);
        });
        socket.on('update camera bans', (data) => {
            sendMessage('update camera bans', data);
        });
        socket.on('update global camera bans', (data) => {
            sendMessage('update camera bans', data);
        });
        socket.on('poke message', (data, callback) => {
            postMessage({
                type: 'poke message',
                data
            })
            sendRequest('poke message', data)
            .then(() => {
                console.log('poke callback true')
                callback(true)
            })
            .catch(() => {
                callback(false)
            })
        });
        socket.on('update points', (data) => {
            sendMessage('update points', data);
        });
        socket.on('update user info', (data) => {
            sendMessage('update user info', data);
        });
        socket.on('received gift', (data) => {
            sendMessage('received gift', data);
        })

        socket.on('repeat connection', () => {
            sendMessage('repeat connection', null);
        })

        socket.io.on('reconnect', () => {
            sendMessage('reconnect', null);
        })

        return;
    }

    /* eslint-disable-next-line no-restricted-globals */
    self.onmessage = (event) => {
        try {
            const { type, mName, mValue, callback } = event.data;
            if (type === 'request') {
                if (socket) {
                    socket.emit(mName, mValue, (result, message) => {
                        console.log('socket callback', result, message)
                        if (!result) {
                            event.ports[0].postMessage({error: message});
                        } else {
                            event.ports[0].postMessage({result: message});
                        }
                    });
                } else {
                    event.ports[0].postMessage({error: 'socket_not_ready'});
                }
            } else if (type === 'emit') {
                if (socket) {
                    socket.emit(mName, mValue);
                }
            } else if (type === 'init') {
                const { token, ismobile } = mValue;
                initSocket(token, ismobile);
            }
            // switch (mName) {
            //     case 'init':
            //         initSocket(mValue);
            //         break;
            //     case 'join':
            //         if (socket) {
            //             socket.emit('join room', mValue, (result) => {
                           
            //             });
            //         }
            //         break;
            //     case 'public message':
            //         if (socket) {
            //             socket.emit(mName, mValue);
            //         }
            //         break;
            //     case 'private message':
            //         if (socket) {
            //             socket.emit(mName, mValue, (data, error) => {
            //                 if (error) {
            //                     event.ports[0].postMessage({error: error});
            //                 } else {
            //                     event.ports[0].postMessage({result: data});
            //                 }
            //             });
            //         }
            //         break;
            //     case 'open private':
            //         if (socket) {
            //             const { to } = mValue;
            //             const newValue = { ...mValue, to:  to? to.username:null };
            //             socket.emit(mName, newValue, (roomName, error) => {
            //                 if(roomName) {
            //                     // privateListRef.current.addChat(to, roomName);
            //                     const { to } = mValue
            //                     postMessage({
            //                         type: 'open private success',
            //                         data: {
            //                             roomName,
            //                             to
            //                         }
            //                     })
            //                 } else {
            //                     if(error === 'private_error_guest') {
            //                         postMessage({
            //                             type: 'private_error_guest'
            //                         })
            //                     }
            //                 }
            //             })
            //         }
            //         break;
            //     case 'connect':
            //         if (socket) {
            //             socket.connect();
            //         }
            //         break;
            //     case 'close':
            //         socket.removeAllListeners();
            //         socket.close();
            //         /* eslint-disable-next-line no-restricted-globals */
            //         self.close()
            //         break;
            //     case 'check camera broadcast':
            //         socket.emit(mName, mValue, (data, error) => {
            //             if (error) {
            //                 event.ports[0].postMessage({error});
            //             } else {
            //                 event.ports[0].postMessage({result: data});
            //             }
            //         })
            //         break;
            //     default:
            //         socket.emit(mName, mValue, () => {
                         
            //         });
            //         break;
            // }
        } catch (err) {
            console.log(err.message)
        }
        // sentData()
        
    }

    const initSocket = (token, ismobile) => {
        createNewSocket(token, ismobile);
        if (!socket.connected) {
            socket.open();
        }
    }
}

export default socketWorker;



