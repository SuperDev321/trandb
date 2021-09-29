import * as mediasoupClient from 'mediasoup-client';
import { mediaSocket } from './socketHandler';
const maxStream = 8;
const mediaType = {
    audio: 'audioType',
    video: 'videoType',
    screen: 'screenType'
}
const _EVENTS = {
    exitRoom: 'exitRoom',
    openRoom: 'openRoom',
    startVideo: 'startVideo',
    stopVideo: 'stopVideo',
    startAudio: 'startAudio',
    stopAudio: 'stopAudio',
    startScreen: 'startScreen',
    stopScreen: 'stopScreen',
    startStream: 'startStream',
    stopStream: 'stopStream',
    changeViewers: 'changeViewers',
    onChangeConsume: 'onChangeConsume',
    onChangeRemoteStreams: 'onChangeRemoteStreams',
    onChangeProduce: 'onChangeProduce',
}



class MediaClient {

    constructor(name, userId = '', socketWorker, successCallback = null) {
        this.name = name
        this.producerTransports = new Map();
        this.consumerTransports = new Map();
        this.devices = new Map();
        this.id = Math.random()
        this.userId = userId;

        this.consumers = new Map()
        this.producers = new Map()
        this.viewers = new Map()

        this.rooms = new Set();

        // save remote producers that can consume
        this.remoteProducers = new Map();

        this.remoteStreams = new Map();
        this.localStreams = new Map();

        /**
         * map that contains a mediatype as key and producer_id as value
         */
        this.producerLabels = new Map()
        this.socketWorker = socketWorker;

        this._isOpen = false
        this.eventListeners = new Map()
        Object.keys(_EVENTS).forEach(function (evt) {
            this.eventListeners.set(evt, [])
        }.bind(this))
    }

    ////////// INIT /////////
    async init() {
        this.initSockets();
        this._isOpen = true;
    }

    async createRoom(room_id) {
        await mediaSocket.request('createMediaRoom', {
            room_id,
            token: 'media_token',
        }).catch(err => {
            console.log(err)
        })
    }

    async join(room_id) {
        try {
            await mediaSocket.request('joinMedia', {
                name: this.name,
                room_id,
                token: 'media_token'
            });

            const data = await mediaSocket.request('getRouterRtpCapabilities', room_id);
            let device = await this.loadDevice(data);
            this.devices.set(room_id, device);
            await this.initTransports(device, room_id);
            this.rooms.add(room_id);
            mediaSocket.request('getProducers', room_id);
        } catch (e) {
            console.log(e);
        }
    }

    clearRoom(room_id) {
        this.devices.delete(room_id);
        let consumerTransport = this.consumerTransports.get(room_id);
        if(consumerTransport) {
            consumerTransport.close();
        }
        let producerTransport = this.producerTransports.get(room_id);
        if(producerTransport) {
            producerTransport.close();
        }
        let producerInfo = this.producers.get(room_id);
        if(producerInfo && producerInfo.producer) {
            producerInfo.producer.close();
        }
        let consumerArr = Array.from(this.consumers.values())
        consumerArr.forEach((item) => {
            if(item && (item.room_id === room_id)) {
                if(item.consumer) {
                    item.consumer.close();
                }
                this.consumers.delete(item.consumer.id);
            }
        })
        this.localStreams.delete(room_id);
        this.remoteStreams.delete(room_id);
        this.viewers.delete(room_id);
        this.event(_EVENTS.stopStream, {room_id});
        this.event(_EVENTS.changeViewers, {room_id});
        this.event(_EVENTS.onChangeRemoteStreams, {room_id});
    }

    exitRoom(room_id) {
        this.rooms.delete(room_id);
        this.devices.delete(room_id);
        let consumerTransport = this.consumerTransports.get(room_id);
        if(consumerTransport) {
            consumerTransport.close();
        }
        let producerTransport = this.producerTransports.get(room_id);
        if(producerTransport) {
            producerTransport.close();
        }
        let producerInfo = this.producers.get(room_id);
        if(producerInfo && producerInfo.producer) {
            producerInfo.producer.close();
        }
        let consumerArr = Array.from(this.consumers.values())
        consumerArr.forEach((item) => {
            if(item && (item.room_id === room_id)) {
                if(item.consumer) {
                    item.consumer.close();
                }
                this.consumers.delete(item.consumer.id);
            }
        })
        this.localStreams.delete(room_id);
        this.remoteStreams.delete(room_id);
        this.viewers.delete(room_id);
        this.event(_EVENTS.stopStream, {room_id});
        this.event(_EVENTS.changeViewers, {room_id});
        this.event(_EVENTS.onChangeRemoteStreams, {room_id});
    }

    async loadDevice(routerRtpCapabilities) {
        let device
        try {
            device = new mediasoupClient.Device();
        } catch (error) {
            if (error.name === 'UnsupportedError') {
                console.error('browser not supported');
            }
            console.error(error)
        }
        await device.load({
            routerRtpCapabilities
        })
        return device

    }

    async initTransports(device, room_id) {

        // init producerTransport
        {
            const data = await mediaSocket.request('createWebRtcTransport', {
                forceTcp: false,
                rtpCapabilities: device.rtpCapabilities,
                room_id
            })
            if (data.error) {
                return;
            }

            const producerTransport = await device.createSendTransport(data);
            this.producerTransports.set(room_id, producerTransport);

            producerTransport.on('connect', async ({
                dtlsParameters
            }, callback, errback) => {
                mediaSocket.request('connectTransport', {
                    dtlsParameters,
                    transport_id: data.id,
                    room_id
                })
                .then(callback)
                .catch(errback)
            });

            producerTransport.on('produce', async ({
                kind,
                rtpParameters,
                appData,
            }, callback, errback) => {
                let locked = false;
                if(appData) 
                    locked = appData.locked;
                
                try {
                    const {
                        producer_id
                    } = await mediaSocket.request('produce', {
                        producerTransportId: producerTransport.id,
                        kind,
                        rtpParameters,
                        room_id,
                        name: this.name,
                        locked
                    });
                    callback({
                        id: producer_id
                    });
                } catch (err) {
                    errback(err);
                }
            })

            producerTransport.on('connectionstatechange', (state) => {
                switch (state) {
                    case 'connecting':

                        break;

                    case 'connected':
                        break;

                    case 'failed':
                        producerTransport.close();
                        this.producerTransports.delete(room_id);
                        break;
                    case 'disconnected':
                        console.log('transport disconnect');
                        this.closeProducer(null, room_id);
                        this.producerTransports.delete(room_id);
                        break;
                    default:
                        break;
                }
            });
        }

        // init consumerTransport
        {
            const data = await mediaSocket.request('createWebRtcTransport', {
                forceTcp: false,
                room_id
            });
            if (data.error) {
                console.error(data.error);
                return;
            }

            // only one needed
            const consumerTransport = await device.createRecvTransport(data);
            
            consumerTransport.on('connect', function ({
                dtlsParameters
            }, callback, errback) {
                mediaSocket.request('connectTransport', {
                        transport_id: consumerTransport.id,
                        dtlsParameters,
                        room_id
                    })
                    .then(callback)
                    .catch(errback);
            });
            consumerTransport.on('connectionstatechange', async (state) => {
                switch (state) {
                    case 'connecting':
                        break;

                    case 'connected':
                        break;

                    case 'failed':
                        consumerTransport.close();
                        this.consumerTransports.delete(room_id);
                        break;
                    case 'disconnected':
                        this.removeRoomConsumers(room_id);
                        this.removeRoomRemoteStreams(room_id);
                        this.consumerTransports.delete(room_id);
                        break;

                    default:
                        break;
                }
            });
            this.consumerTransports.set(room_id, consumerTransport);
        }
    }

    initSockets() {
        mediaSocket.on('consumerClosed', function ({
            consumer_id,
            room_id
        }) {
            console.log('consumer closed from socket')
            this.removeConsumer(consumer_id, room_id);
        }.bind(this))

        /**
         * data: [ {
         *  producer_id:
         *  producer_socket_id:
         * }]
         */
        mediaSocket.on('newProducers', async function (data) {
            for (let {
                    producer_id,
                    producer_name,
                    room_id,
                    producer_socket_id,
                    locked
                } of data) {
                    // this.addRemoteProducer(producer_id, producer_name, room_id);
                    await this.consume(producer_id, producer_name, producer_socket_id, locked, room_id);
            }
        }.bind(this))

        mediaSocket.on('start view', (data) => {
            let {name, room_id} = data;
            this.addViewer(room_id, name);
        })

        mediaSocket.on('stop view', (data) => {
            
            let {name, room_id} = data;
            this.deleteViewer(room_id, name);
        })

        // mediaSocket.on('stop broadcast', (data) => {
        //     let {name, room_id} = data;
        //     this.removeRemoteStream(name, null, room_id);
        // })

        mediaSocket.on('disconnect' ,function (reason) {
            this.rooms.forEach((room) => {
                this.clearRoom(room);
            })
            if (reason === "io server disconnect") {
                // the disconnection was initiated by the server, you need to reconnect manually
                mediaSocket.connect();
            }
        }.bind(this))

        mediaSocket.on('connect_error' ,function () {
            console.log('media socket error')
        })

        mediaSocket.io.on('reconnect', async () => {
            this.rooms.forEach(async (room) => {
                console.log('reconnect', room, this.id)
                await this.createRoom(room);
                await this.join(room);
            })
        })

        mediaSocket.io.on('reconnect_attempt', () => {
        })
    }

    //////// MAIN FUNCTIONS /////////////


    async produce(room_id, locked = false , videoDeviceId = null ,audioDeviceId = null) {
        let mediaConstraints = {}
        mediaConstraints = {
            audio: (audioDeviceId && audioDeviceId !== '')? {
                deviceId: {
                    exact: audioDeviceId
                }
            }: false,
            video: (videoDeviceId && videoDeviceId !== '') ? {
                deviceId: {
                    exact: videoDeviceId,
                },
                // width: {
                //     min: 640,
                //     ideal: 2000
                // },
                // height: {
                //     min: 400,
                //     ideal: 1000
                // },
            }: false
        }
        let device = this.devices.get(room_id);
        if(!device) {
            console.error('cannot find device for produce');
            return;
        }
        if (!device.canProduce('video')) {
            console.error('cannot produce video');
            return;
        }
        let stream;
        try {
            let audioState = false;
            let videoState = true;
            navigator.getUserMedia = (navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia);
            stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);

            const videoTrack = stream.getVideoTracks()[0];
            const videoParams = {
                track: videoTrack,
                appData: {
                    locked
                }
            };
            // if (!audio) {
            videoParams.encodings = [{
                    rid: 'r0',
                    maxBitrate: 100000,
                    //scaleResolutionDownBy: 10.0,
                    scalabilityMode: 'S1T3'
                },
                {
                    rid: 'r1',
                    maxBitrate: 300000,
                    scalabilityMode: 'S1T3'
                },
                {
                    rid: 'r2',
                    maxBitrate: 900000,
                    scalabilityMode: 'S1T3'
                },
            ];
            videoParams.codecOptions = {
                videoGoogleStartBitrate: 1000
            };

            let producerTransport = this.producerTransports.get(room_id);
            if(!producerTransport) return;

            

            let videoProducer = await producerTransport.produce(videoParams)

            videoProducer.on('trackended', () => {
                this.closeProducer(videoProducer.id, room_id)
            })

            videoProducer.on('transportclose', () => {
                this.removeRoomProducers(room_id);
            })

            videoProducer.on('close', () => {
                this.removeRoomProducers(room_id);
            })
            this.producers.set(videoProducer.id, {
                producer: videoProducer,
                room_id,
            })
            let audioProducer = null;
            if(audioDeviceId) {
                audioState = true
                let audioTrack = stream.getAudioTracks()[0];
                let audioParams = {
                    track: audioTrack,
                    videoGoogleStartBitrate: 1000,
                    appData: {
                        locked
                    }
                }
                audioProducer = await producerTransport.produce(audioParams);
                audioProducer.on('trackended', () => {
                    this.closeProducer(audioProducer.id, room_id)
                })
    
                audioProducer.on('transportclose', () => {
                    this.producers.delete(audioProducer.id);
                    this.event(_EVENTS.stopAudio, {room_id});
                })
    
                audioProducer.on('close', () => {
                    this.producers.delete(audioProducer.id);
                    this.event(_EVENTS.stopAudio, {room_id});
                })
                this.producers.set(audioProducer.id, {
                    producer: audioProducer,
                    room_id,
                })
            }
            let label = this.producerLabels.get(room_id);
            if(label) {
                this.producerLabels.delete(room_id);
            }
            this.producerLabels.set(room_id, {
                audio: audioProducer? audioProducer.id: null,
                video: videoProducer? videoProducer.id: null,
                locked
            })
            
            this.startStream(room_id, stream, locked, audioState, videoState);
            return {
                producers: {
                    audio: audioProducer? audioProducer.id : null,
                    video: videoProducer? videoProducer.id: null
                },
                locked
            };
        } catch (err) {
            console.log('produce error: ', err);
            return false;
        }
    }

    // add remote producer info
    addRemoteProducer(producer_id, name, room_id) {
        if(!this.remoteProducers.has(room_id)) {
            const roomProducers = new Map();
            this.remoteProducers.set(room_id, roomProducers);
        }
        const roomProducers = this.remoteProducers.get(room_id);
        if(!roomProducers.has(name)) {
            const producers = new Set();
            roomProducers.set(name, producers);
        }
        const producers = roomProducers.get(name);
        producers.add(producer_id);
    }
    // remote remote producer info
    deleteRemoteProducer(producer_id, name, room_id) {
        if(this.remoteProducers.has(room_id)) {
            const roomProducers = this.remoteProducers.get(room_id);
            if(roomProducers.has(name)) {
                const producers = roomProducers.get(name);
                producers.delete(producer_id);
            }
        }
        
    }

    async consume(producer_id, locked, room_id, producerName) {
        return this.getConsumer(producer_id, room_id).then((data) => {
            if(!data) return null;
            let {
                consumer,
                kind,
                // name
            } = data;
            consumer.on('trackended', ()  => {
                console.log('track ended');
                this.removeConsumer(consumer.id)
            })
            consumer.on('transportclose', ()  => {
                console.log('transport close');
                this.removeConsumer(consumer.id)
            })
            consumer.on('producerclose', ()  => {
                console.log('prouder close')
                this.removeConsumer(consumer.id)
            })
            consumer.on('producerpause', ()  => {
                consumer.pause();
            })
            consumer.on('producerresume', ()  => {
                consumer.pause();
            })
            this.addConsumer(room_id, producerName, kind, locked, consumer);
            return consumer;
        })
    }

    async getConsumer(producerId, room_id) {
        const device = this.devices.get(room_id);
        const consumerTransport = this.consumerTransports.get(room_id);
        if(!device || !consumerTransport) {
            return false;
        }
        const {
            rtpCapabilities
        } = device;
        const data = await mediaSocket.request('consume', {
            rtpCapabilities,
            consumerTransportId: consumerTransport.id, // might be 
            producerId,
            room_id
        });
        const {
            id,
            kind,
            name,
            rtpParameters,
        } = data;

        let codecOptions = {};
        const consumer = await consumerTransport.consume({
            id,
            producerId,
            kind,
            rtpParameters,
            codecOptions,
        })
        return {
            consumer,
            // stream,
            kind,
            name
        }
    }

    async addConsumer(room_id, name, kind, locked, consumer) {
        this.consumers.set(consumer.id, {
            consumer,
            kind,
            room_id,
            name,
            locked
        });
    }

    async requestView(room_id, user_id, name, producers, locked, fn1, fn2) {
        if (name === this.name) {
            return false;
        }
        let roomStream = this.remoteStreams.get(room_id);
        if(roomStream) {
            let streamInfo = roomStream.get(name);
            if(streamInfo && streamInfo.stream && (streamInfo.name === name)) {
                if (fn1) {
                    return fn1(false);
                } else {
                    return false;
                }
                
            }
        }

        if (locked) {
            fn1(true);
            this.socketWorker.request('view request', {
                roomName: room_id,
                username: this.name,
                userId: this.userId,
                targetName: name,
            })
            .then(() => {
                this.addRemoteStream(room_id, name, user_id, producers, true);
                if (fn2) {
                    fn2(true);
                }
            })
            .catch((e) => {
                if (fn2) {
                    fn2(false);
                }
            })
        } else {
            this.addRemoteStream(room_id, name, user_id, producers, false);
        }
    }
    async addRemoteStream(room_id, name, user_id, producers, locked) {
        let  audioTrack = null;
        let videoTrack = null;
        if (!producers) {
            return;
        }
        const { video: videoProducerId, audio: audioProducerId } = producers;

        if (videoProducerId) {
            const videoConsumer = await this.consume(videoProducerId, false, room_id, name);
            if (videoConsumer) {
                videoTrack = videoConsumer.track;
            }
        }
        if (audioProducerId) {
            const audioConsumer = await this.consume(audioProducerId, false, room_id, name);
            if (audioConsumer) {
                audioTrack = audioConsumer.track;
            }
        }
        if(videoTrack) {
            if(this.remoteStreams.has(room_id)) {
                const roomStreams = this.remoteStreams.get(room_id);
                if(roomStreams.has(name)) {
                    let {stream} = roomStreams.get(name);
                    if(stream) {
                        stream.getTracks().forEach((track) => {
                            track.stop();
                        });
                        stream.addTrack(videoTrack);
                        if(audioTrack) {
                            stream.addTrack(audioTrack);
                        }
                    } else {
                        const stream = new MediaStream();
                        const time = new Date();
                        stream.addTrack(videoTrack);
                        if(audioTrack) {
                            stream.addTrack(audioTrack);
                        }
                        this.removeOldRemoteStream(room_id);
                        roomStreams.set(name, {
                            stream,
                            locked,
                            name,
                            time
                        });
                    }
                } else {
                    const stream = new MediaStream();
                    const time = new Date();
                    stream.addTrack(videoTrack);
                    if(audioTrack) {
                        stream.addTrack(audioTrack);
                    }
                    this.removeOldRemoteStream(room_id);
                    roomStreams.set(name, {
                        stream,
                        locked,
                        name,
                        time
                    });
                }
            } else {
                const stream = new MediaStream();
                const time = new Date();
                stream.addTrack(videoTrack);
                if(audioTrack) {
                    stream.addTrack(audioTrack);
                }
                const newRoomStreams = new Map();
                newRoomStreams.set(name, {
                    stream,
                    locked,
                    name,
                    time
                });
                this.remoteStreams.set(room_id, newRoomStreams);
            }
            this.socketWorker.emit('start view', {
                room_id,
                name: this.name,
                targetName: name
            });
            this.event(_EVENTS.onChangeRemoteStreams, {room_id});
        }
    }
    // addRemoteStream(room_id, name) {
    //     let  audioTrack = null;
    //     let videoTrack = null;
    //     let socket_id = null;
    //     let locked = null;
    //     let consumersArr = Array.from(this.consumers.values());
    //     let roomConsumers = consumersArr.filter((item) => (item.room_id === room_id && item.name === name));
    //     roomConsumers.forEach((item) => {
    //         if(item.kind === 'video') {
    //             locked = item.locked;
    //             videoTrack = item.consumer.track;
    //             socket_id = item.socket_id
    //         } else if(item.kind === 'audio'){
    //             audioTrack = item.consumer.track;
    //         }
    //     })
    //     if(videoTrack && socket_id) {
    //         if(this.remoteStreams.has(room_id)) {
    //             const roomStreams = this.remoteStreams.get(room_id);
    //             if(roomStreams.has(name)) {
    //                 let {stream} = roomStreams.get(name);
    //                 if(stream) {
    //                     stream.getTracks().forEach((track) => {
    //                         track.stop();
    //                     });
    //                     stream.addTrack(videoTrack);
    //                     if(audioTrack) {
    //                         stream.addTrack(audioTrack);
    //                     }
    //                 } else {
    //                     const stream = new MediaStream();
    //                     const time = new Date();
    //                     stream.addTrack(videoTrack);
    //                     if(audioTrack) {
    //                         stream.addTrack(audioTrack);
    //                     }
    //                     this.removeOldRemoteStream(room_id);
    //                     roomStreams.set(name, {
    //                         stream,
    //                         locked,
    //                         name,
    //                         socket_id,
    //                         time
    //                     });
    //                 }
    //             } else {
    //                 const stream = new MediaStream();
    //                 const time = new Date();
    //                 stream.addTrack(videoTrack);
    //                 if(audioTrack) {
    //                     stream.addTrack(audioTrack);
    //                 }
    //                 this.removeOldRemoteStream(room_id);
    //                 roomStreams.set(name, {
    //                     stream,
    //                     locked,
    //                     name,
    //                     socket_id,
    //                     time
    //                 });
    //             }
    //         } else {
    //             const stream = new MediaStream();
    //             const time = new Date();
    //             stream.addTrack(videoTrack);
    //             if(audioTrack) {
    //                 stream.addTrack(audioTrack);
    //             }
    //             const newRoomStreams = new Map();
    //             newRoomStreams.set(name, {
    //                 stream,
    //                 locked,
    //                 socket_id,
    //                 name,
    //                 time
    //             });
    //             this.remoteStreams.set(room_id, newRoomStreams);
    //         }
    //         mediaSocket.emit('start view', {
    //             room_id,
    //             name: this.name,
    //             socket_id
    //         });
    //         this.event(_EVENTS.onChangeRemoteStreams, {room_id});
    //     }
    // }

    removeOldRemoteStream(room_id) {
        let roomStreams = this.remoteStreams.get(room_id);
        if(roomStreams) {
            if(roomStreams.size >= maxStream) {
                let streamArr = Array.from(roomStreams.values());
                let oldTime = null;
                let oldName = null
                streamArr.forEach(({time, name}) => {
                    if(time) {
                        if((!oldTime) || (oldTime && oldTime > time)) {
                            oldTime = time;
                            oldName = name;
                        }
                    }
                })
                if(oldName) {
                    if(roomStreams.has(oldName)) {
                        // let {stream} = roomStreams.get(oldName);
                        // stream.getTracks().forEach((track) => {
                        //     track.stop();
                        // })
                        roomStreams.delete(oldName);
                    }
                }
            }
        }
    }

    removeRoomProducers(room_id) {
        let label = this.producerLabels.get(room_id);
        if(!label) {
            console.log('there is no room ', room_id);
        }
        if(label.audio) {
            this.producers.delete(label.audio);
        }
        if(label.video) {
            this.producers.delete(label.video);
        }
        this.producerLabels.delete(room_id);
        this.localStreams.delete(room_id);
        this.viewers.delete(room_id);
        this.event(_EVENTS.onChangeProduce, {room_id, type: 'close'});
        this.event(_EVENTS.stopStream, {room_id});
        this.event(_EVENTS.changeViewers, {room_id});
    }

    closeProducer(type, room_id) {
        let label = this.producerLabels.get(room_id)
        if(!label) {
            this.producerLabels.delete(room_id);
            this.viewers.delete(room_id);
            if (this.localStreams.has(room_id)) {
                let item = this.localStreams.get(room_id);
            }
            this.localStreams.delete(room_id);
            this.event(_EVENTS.stopStream, {room_id});
            this.event(_EVENTS.changeViewers, {room_id});
            return;
        }
        if(type === 'audio') {
            let producer_id = label['audio'];
            let producerInfo = this.producers.get(producer_id);
            if(!producerInfo) {
                return;
            }
            mediaSocket.emit('producerClosed', {
                producer_id,
                room_id
            })
            producerInfo.producer.close();
            this.producers.delete(producer_id);
            delete label['audio'];
            this.event(_EVENTS.onChangeProduce, {room_id, type: 'close audio'});
        } else {
            let audioProducerId = label['audio'];
            let videoProducerId = label['video'];
            
            let audioProducerInfo = this.producers.get(audioProducerId);
            if(audioProducerInfo) {
                audioProducerInfo.producer.close();
                this.producers.delete(audioProducerId);
            }
            let videoProducerInfo = this.producers.get(videoProducerId);
            if(videoProducerInfo) {
                videoProducerInfo.producer.close();
                this.producers.delete(videoProducerId);
            }
            this.producerLabels.delete(room_id);
            this.viewers.delete(room_id);
            if (this.localStreams.has(room_id)) {
                const { stream } = this.localStreams.get(room_id);
                if (stream) {
                    stream.getTracks().forEach((track) => {
                        track.stop();
                    })
                }
            }
            this.localStreams.delete(room_id);
            mediaSocket.emit('roomProducersClosed', {
                room_id
            });
            // this.event(_EVENTS.onChangeProduce, {room_id, type: 'close'});
            this.event(_EVENTS.changeViewers, {room_id});
            this.event(_EVENTS.stopStream, {room_id});
        }
    }

    async pauseProducer (room_id, kind) {
        if (!this.producerLabels.has(room_id)) {
            return;
        }
        let label = this.producerLabels.get(room_id);
        if(label) {
            let {audio: audioId, video: videoId} = label;
            if((!kind || kind === 'audio') && audioId) {
                let audioProducer = this.producers.get(audioId);
                if(audioProducer && audioProducer.producer) {
                    await audioProducer.producer.pause();
                }
                let stream = this.localStreams.get(room_id);
                stream.audioState = false;
                this.event(_EVENTS.startStream, {room_id});
            }
            if((!kind || kind === 'video') && videoId) {
                let videoProducer = this.producers.get(videoId);
                if(videoProducer && videoProducer.producer) {
                    await videoProducer.producer.pause();
                }
                let stream = this.localStreams.get(room_id);
                stream.videoState = false;
                this.event(_EVENTS.startStream, {room_id});
            }
        }
    }

    async resumeProducer (room_id, kind) {
        if (!this.producerLabels.has(room_id)) {
            return;
        }
        let label = this.producerLabels.get(room_id);
        if (label) {
            let {audio: audioId, video: videoId} = label;
            if ((!kind || kind === 'audio') && audioId) {
                let audioProducer = this.producers.get(audioId);
                if(audioProducer && audioProducer.producer) {
                    audioProducer.producer.resume();
                }
                let stream = this.localStreams.get(room_id);
                stream.audioState = true;
                this.event(_EVENTS.startStream, {room_id});
            }
            if ((!kind || kind === 'video') && videoId) {
                let videoProducer = this.producers.get(videoId);
                if(videoProducer && videoProducer.producer) {
                    videoProducer.producer.resume();
                }
                let stream = this.localStreams.get(room_id);
                stream.videoState = true;
                this.event(_EVENTS.startStream, {room_id});
            }
        }
    }

    closeRemoteStream(room_id, name) {

    }

    closeConsumer(consumer_id, room_id) {
        console.log('close consumer')
        let consumerInfo = this.consumers.get(consumer_id);
        if(consumerInfo) {
            let {kind, room_id, name, consumer} = consumerInfo;
            consumer.close();
            console.log('close consumer')
            this.removeRemoteStream(name, kind, room_id)
            this.consumers.delete(consumer_id);
            this.event(_EVENTS.onChangeConsume, {room_id})
        }
    }

    removeConsumer(consumer_id, room_id) {
        console.log('remove consumer')

        let consumerInfo = this.consumers.get(consumer_id);
        if(consumerInfo) {
            let {kind, room_id, name} = consumerInfo;
            console.log('close consumer')
            this.removeRemoteStream(name, kind, room_id)
            
            this.consumers.delete(consumer_id);
            this.event(_EVENTS.onChangeConsume, {room_id})
        }
        // this.event(_EVENTS.onChangeConsume, {room_id})
    }

    async removeRoomConsumers (room_id) {
        let consumersArr = Array.from(this.consumers.values());
        let roomConsumers = consumersArr.filter((item) => (item.room_id === room_id));
        roomConsumers.forEach((item) => {
            if (item) {
                const { consumer } = item;
                if (consumer) {
                    consumer.close();
                    this.consumers.delete(consumer.id);
                }
            }
        });
    }

    removeRemoteStream(name, kind, room_id) {
        console.log('remove remote stream')
        const roomStreams = this.remoteStreams.get(room_id);
        if(roomStreams && roomStreams.has(name)) {
            let { stream } = roomStreams.get(name);
            if(stream) {
                if(kind === 'audio') {
                    let audioTracks = stream.getAudioTracks();
                    if(audioTracks && audioTracks.length > 0) {
                        audioTracks[0].stop();
                    }
                } else {
                    stream.getTracks().forEach((track) => {
                        track.stop();
                    });
                    roomStreams.delete(name);
                    this.socketWorker.emit('stop view', {
                        room_id,
                        name: this.name,
                        targetName: name
                    })
                }
                this.event(_EVENTS.onChangeRemoteStreams, {room_id})
            }
        }
    }

    async removeRoomRemoteStreams(room_id) {
        const roomStreams = this.remoteStreams.get(room_id);
        if(roomStreams) {
            const streams = Array.from(roomStreams.values());
            streams.forEach((item) => {
                const { stream } = item;
                if(stream) {
                    stream.getTracks().forEach((track) => {
                        track.stop();
                    });
                }
            })
        }
        this.remoteStreams.delete(room_id);
        this.event(_EVENTS.onChangeRemoteStreams, {room_id})
    }


    // stopView(room_id, targetId, name) {
    //     // let roomStreams = this.remoteStreams.get(room_id);
    //     mediaSocket.request('stop broadcast', {
    //         room_id,
    //         name: this.name,
    //         targetName: name,
    //     })
    // }

    async stopView(room_id, targetId, name) {
        this.socketWorker.emit('stop broadcast to', {
            room_id,
            name: this.name,
            targetName: name,
        })
    }
 
    exit(offline = false) {
        let clean = function () {
            this._isOpen = false
            if(this.consumerTransports.size > 0) {
                this.consumerTransports.forEach((transport) => {
                    transport.close();
                })
            }
                
            if(this.producerTransports.size > 0) {
                this.producerTransports.forEach((transport) => {
                    transport.close();
                })
            }

            if(this.producers.size > 0) {
                this.producers.forEach((producerInfo) => {
                    if(producerInfo && producerInfo.producer) {
                        producerInfo.producer.close();
                    }
                })
            }
            mediaSocket.removeAllListeners();
            // mediaSocket.off('disconnect')
            // mediaSocket.off('newProducers')
            // mediaSocket.off('consumerClosed')
        }.bind(this)

        if (!offline) {
            mediaSocket.request('exit').then(e => console.log(e)).catch(e => console.warn(e)).finally(function () {
                clean()
            })
        } else {
            clean()
        }
    }

    ///////  HELPERS //////////

    static get mediaType() {
        return mediaType
    }

    event(evt, data = null) {
        if (this.eventListeners.has(evt)) {
            this.eventListeners.get(evt).forEach(callback => callback(data))
        }
    }

    on(evt, callback) {
        this.eventListeners.get(evt).push(callback)
    }

    off(evt) {
        this.eventListeners.delete(evt);
    }

    offAll() {
        this.eventListeners.clear();
    }

    async startStream(room_id, stream, locked, audioState, videoState) {
        if (this.localStreams.size > 0) {
            let keys = this.localStreams.keys();
            const key = keys.next().value;
            const value = this.localStreams.get(key);
            const { stream } = value;
            if (stream) {
                return key;
            }
        }
        if(this.localStreams.has(room_id)) {
            const { stream } = this.localStreams.get(room_id);
            if (stream) {
                stream.getTracks().forEach((track) => {
                    track.stop()
                });
                this.localStreams.delete(room_id);
            }
        }
        this.localStreams.set(room_id, {
            stream,
            locked,
            audioState,
            videoState
        });
        this.event(_EVENTS.startStream, { room_id });
        return true;
    }

    async stopStream(room_id) {
        if (this.localStreams.has(room_id)) {
            const { stream } = this.localStreams.get(room_id);
            if (stream) {
                stream.getTracks().forEach((track) => {
                    track.stop()
                });
                this.localStreams.delete(room_id);
            }
            this.event(_EVENTS.stopStream, { room_id });
        }
    }

    // send request to view
    // add my viewers to room
    addViewer(room_id, name) {
        if(!this.viewers.has(room_id)) {
            const roomViewers = new Set();
            this.viewers.set(room_id, roomViewers);
        }
       
        let roomViewers = this.viewers.get(room_id);
        roomViewers.add(name);
        this.event(_EVENTS.changeViewers, {room_id});
    }
    // delete my viewer of room
    deleteViewer(room_id, name) {
        let roomViewers = this.viewers.get(room_id);
        if(roomViewers) {
            roomViewers.delete(name);
            this.event(_EVENTS.changeViewers, {room_id});
        }
    }
    // get viewers
    getViewers(room_id) {
        if(this.viewers.get(room_id)) {
            const roomViewers = this.viewers.get(room_id);
            if(roomViewers) {
                let viewers = Array.from(roomViewers);
                return viewers;
            }
        }
        return [];
    }
    // get all live users
    getLiveUsers(room_id) {
        let consumersArr = Array.from(this.consumers.values());
        let roomConsmers = consumersArr.filter((item) => (item.room_id === room_id));
        let liveUsers = roomConsmers.map(({name, locked}) => ({name, locked}));
        return liveUsers;
    }

    getRemoteStreams(room_id) {
        if(this.remoteStreams.has(room_id)) {
            let roomStreams = this.remoteStreams.get(room_id);
            let streams = Array.from(roomStreams.values());
            return streams;
        } else {
            return [];
        }
    }

    getLocalStream (room_id) {
        if(this.localStreams.has(room_id)) {
            return this.localStreams.get(room_id);
        } else {
            return null;
        }
    }



    //////// GETTERS ////////

    isOpen() {
        return this._isOpen
    }

    static get EVENTS() {
        return _EVENTS
    }
}

export {MediaClient, _EVENTS, mediaType};
