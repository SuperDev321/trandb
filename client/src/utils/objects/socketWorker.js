
const socketWorker = () => {
    /* eslint-disable-next-line no-restricted-globals */
    self.importScripts("https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.1.2/socket.io.js");
    /* eslint-disable-next-line no-restricted-globals */
    const JSONfn = {
        parse:function (str, date2obj) {
            var iso8061 = date2obj ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/ : false;
    
            return JSON.parse(str, function (key, value) {
                var prefix,
                    func, fnArgs, fnBody ;
        
                if (typeof value !== 'string') {
                return value;
                }
                if (value.length < 8) {
                return value;
                }
        
                prefix = value.substring(0, 8);
        
                if (iso8061 && value.match(iso8061)) {
                return new Date(value);
                }
                if (prefix === 'function') {
                return eval('(' + value + ')');
                }
                if (prefix === '_PxEgEr_') {
                return eval(value.slice(8));
                }
                if (prefix === '_NuFrRa_') {
                func = value.slice(8).trim().split('=>');
                fnArgs = func[0].trim();
                fnBody = func[1].trim();
                if(fnArgs.indexOf('(') < 0) {
                    fnArgs = '('+ fnArgs +')';
                }
                if(fnBody.indexOf('{') < 0) {
                    fnBody = '{ return '+ fnBody +'}';
                }
                return eval('(' + 'function' + fnArgs + fnBody +')');
                }
        
                return value;
            });
        },
        stringify: function (obj) {
            return JSON.stringify(obj, function (key, value) {
              var fnBody;
              if (value instanceof Function || typeof value == 'function') {
        
        
                fnBody = value.toString();
        
                if (fnBody.length < 8 || fnBody.substring(0, 8) !== 'function') { //this is ES6 Arrow Function
                  return '_NuFrRa_' + fnBody;
                }
                return fnBody;
              }
              if (value instanceof RegExp) {
                return '_PxEgEr_' + value;
              }
              return value;
            });
        }
    }

    let socket = null;
    
    const createNewSocket = (token) => {
        console.log('create new socket', token)
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
                ismobile: false
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
            postMessage({
                type: 'init room',
                data,
            })
            callback('success');
        })

        socket.on('room message', (data) => {
            postMessage({
                type: 'room message',
                data,
            })
        })

        socket.on('disconnect', (reason) => {
            postMessage({
                type: 'disconnect',
                data: {
                    reason
                }
            })
        })

        socket.on('joined room', (data) => {
            postMessage({
                type: 'joined room',
                data
            })
        })

        socket.on('leave room', async (data) => {
            postMessage({
                type: 'leave room',
                data
            })
        });

        socket.on('kicked user', async (data) => {
            postMessage({
                type: 'kicked user',
                data
            })
        });

        socket.on('banned user', async (data) => {
            postMessage({
                type: 'banned user',
                data
            })
        });

        socket.on('global banned user', async (data) => {
            postMessage({
                type: 'global banned user',
                data
            })
        });

        socket.on('update block',  async (data) => {
            postMessage({
                type: 'update block',
                data
            })
        });
        socket.on('update global block',  async (data) => {
            postMessage({
                type: 'update global block',
                data
            })
        });
        socket.on('update camera bans', async (data) => {
            postMessage({
                type: 'update camera bans',
                data
            })
        });
        socket.on('update global camera bans', async (data) => {
            postMessage({
                type: 'update global camera bans',
                data
            })
        });
        socket.on('poke message', async (data) => {
            postMessage({
                type: 'poke message',
                data
            })
        });
        socket.on('update points', async (data) => {
            postMessage({
                type: 'update points',
                data
            })
        });
        socket.on('update user info', async (data) => {
            postMessage({
                type: 'update user info',
                data
            })
        });

        socket.io.on('reconnect', () => {
            postMessage({
                type: 'reconnect'
            })
        })

        return;
    }

    /* eslint-disable-next-line no-restricted-globals */
    self.onmessage = (event) => {
        try {
            
            const { mName, mValue, callback } = event.data;
            console.log('socket emit', mName, mValue)
            switch (mName) {
                case 'init':
                    initSocket(mValue);
                    break;
                case 'join':
                    if (socket) {
                        socket.emit('join room', mValue, (result) => {
                            const {joinFunction, enqueueSnackbar} = JSONfn.parse(callback);
                            if (joinFunction(true)) {
                                console.log('ok')
                            } else {
                                console.log('no')
                            }
                        });
                    }
                    break;
                case 'public message':
                    socket.emit(mName, mValue);
                    break;
                case 'private message':
                    socket.emit(mName, mValue, (data, error) => {
                        if (!data && error) {
                            const { roomName } = mValue;
                            const type = 'private_error_'+error;
                            postMessage({
                                type,
                                data: { roomName }
                            })
                        }
                    });
                    break;
                case 'open private':
                    const { to } = mValue;
                    const newValue = { ...mValue, to:  to? to.username:null };
                    socket.emit(mName, newValue, (roomName, error) => {
                        if(roomName) {
                            // privateListRef.current.addChat(to, roomName);
                            const { to } = mValue
                            postMessage({
                                type: 'open private success',
                                data: {
                                    roomName,
                                    to
                                }
                            })
                        } else {
                            if(error === 'private_error_guest') {
                                postMessage({
                                    type: 'private_error_guest'
                                })
                            }
                        }
                    })
                    break;
                case 'connect':
                    socket.connect();
                    break;
                case 'close':
                    socket.removeAllListeners();
                    socket.close();
                    /* eslint-disable-next-line no-restricted-globals */
                    self.close()
                    break;
                default:
                    socket.emit(mName, mValue, () => {
                         
                    });
                    break;
            }
        } catch (err) {
            console.log(err.message)
        }
        // sentData()
        
    }

    const initSocket = (token) => {
        createNewSocket(token);
        if (!socket.connected) {
            socket.open();
        }
    }
}

export default socketWorker;



