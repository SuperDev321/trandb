import * as mediasoupClient from 'mediasoup-client';
import {mediaSocket} from './socketHandler';
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

    constructor(name, successCallback = null) {
        this.name = name
        this.producerTransports = new Map();
        this.consumerTransports = new Map();
        this.devices = new Map();

        this.consumers = new Map()
        this.producers = new Map()
        this.viewers = new Map()

        this.rooms = new Set();

        // save remote producers that can consume
        this.remoteProducers = new Map();

        this.remoteStreams = new Map();
        this.localStreams = new Map();

        this.producer = null;
        /**
         * map that contains a mediatype as key and producer_id as value
         */
        this.producerLabels = new Map()

        this._isOpen = false
        this.eventListeners = new Map()
        Object.keys(_EVENTS).forEach(function (evt) {
            this.eventListeners.set(evt, [])
        }.bind(this))
        
        this._isOpen = false;
        // this.createRoom(room_id).then(async function () {
        //     await this.join(name, room_id)
        //     console.log('joined room', room_id, name)
        //     this.initSockets()
        //     this._isOpen = true
        //     // successCallback()
        // }.bind(this))
    }

    ////////// INIT /////////
    async init() {
        this.initSockets();
        this._isOpen = true;
    }

    async createRoom(room_id) {
        console.log(mediaSocket);
        await mediaSocket.request('createMediaRoom', {
            room_id
        }).catch(err => {
            console.log(err)
        })
    }

    async join(room_id) {
        console.log('join media', room_id, this.name, mediaSocket)
        try {
            let result = await mediaSocket.request('joinMedia', {
                name: this.name,
                room_id
            });

            const data = await mediaSocket.request('getRouterRtpCapabilities', room_id);
            let device = await this.loadDevice(data)
            this.devices.set(room_id, device);
            await this.initTransports(device, room_id);
            this.rooms.add(room_id);
            mediaSocket.request('getProducers', room_id);
        } catch (e) {
            console.log(e);
        }
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
                console.error(data.error);
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
                        //localVideo.srcObject = stream
                        break;

                    case 'failed':
                        producerTransport.close();
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
            }.bind(this));
            consumerTransport.on('connectionstatechange', async (state) => {
                switch (state) {
                    case 'connecting':
                        break;

                    case 'connected':
                        console.log('consumer transport connected')
                        //remoteVideo.srcObject = await stream;
                        //await mediaSocket.request('resume');
                        break;

                    case 'failed':
                        consumerTransport.close();
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
            console.log('closing consumer:', consumer_id, room_id)
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
            let {name, producer_id, room_id} = data;
            this.addViewer(room_id, name);
        })

        mediaSocket.on('stop view', (data) => {
            
            let {name, producer_id, room_id} = data;
            console.log('stop view', name, room_id)
            this.deleteViewer(room_id, name);
        })

        mediaSocket.on('stop broadcast', (data) => {
            console.log('stop broadcast');
            let {name, room_id} = data;
            this.removeRemoteStream(name, null, room_id);
        })

        mediaSocket.on('disconnect' ,function (reason) {
            if (reason === "io server disconnect") {
                // the disconnection was initiated by the server, you need to reconnect manually
                mediaSocket.connect();
            }
        }.bind(this))

        mediaSocket.on('connect_error' ,function () {
            setTimeout(() => {
                mediaSocket.connect();
            }, 1000);
        }.bind(this))

        mediaSocket.io.on('reconnect', async () => {
            console.log('media socket reconnect');

            this.rooms.forEach(async (room) => {
                await this.createRoom(room);
                await this.join(room);
            })
        })

        mediaSocket.io.on('reconnect_attempt', () => {
            console.log('reconnect_attempt');
        })


    }

    //////// MAIN FUNCTIONS /////////////


    async produce(room_id, locked = false , videoDeviceId = null ,audioDeviceId = null) {
        let mediaConstraints = {}
        mediaConstraints = {
            audio: audioDeviceId? {
                deviceId: {
                    exact: audioDeviceId
                }
            }: false,
            video: videoDeviceId? {
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
                console.log('producer transport close')
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
                    console.log('producer transport close')
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
            
            console.log('start local stream', stream, locked);
            this.startStream(room_id, stream, locked);
        } catch (err) {
            console.log('produce error: ', err)
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

    async consume(producer_id, producer_name, producer_socket_id, locked, room_id) {
        this.getConsumer(producer_id, room_id).then((data) => {
            if(!data) return;
            let {
                consumer,
                kind,
                name
            } = data;
            consumer.on('trackended', ()  => {
                console.log('remote consumer track ended');
                this.removeConsumer(consumer.id)
            })
            consumer.on('transportclose', ()  => {
                console.log('remote consumer track transport close')
                this.removeConsumer(consumer.id)
            })
            this.addConsumer(room_id, producer_name, producer_socket_id, kind, locked, consumer);
            // if(!locked) {
            //     this.addRemoteStream(room_id, producer_name, producer_socket_id, kind, locked, consumer);
            // }
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

    async addConsumer(room_id, name, socket_id, kind, locked, consumer) {
        this.consumers.set(consumer.id, {
            consumer,
            kind,
            room_id,
            name,
            socket_id,
            locked
        });
        console.log('consuemrs', this.consumers)
        this.event(_EVENTS.onChangeConsume, {room_id});
    }

    requestView(room_id, user_id, name, fn1, fn2) {

        let roomStream = this.remoteStreams.get(room_id);
        if(roomStream) {
            let streamInfo = roomStream.get(name);
            if(streamInfo && streamInfo.stream && (streamInfo.name === name)) {
                return fn1(false);
            }
        }
        let consumersArr = Array.from(this.consumers.values());
        let roomConsumers = consumersArr.filter((item) => (item.room_id === room_id));
        if(roomConsumers) {
            let videoConsumer = roomConsumers.find((item) => (item.kind === 'video' && item.name === name));
            if(videoConsumer) {
                let {locked, socket_id} = videoConsumer;
                console.log(videoConsumer, locked, socket_id)
                if(locked) {
                    fn1(true);
                    mediaSocket.emit('view request', {
                        roomName: room_id,
                        username: this.name,
                        targetId: user_id,
                        socket_id
                    }, (result) => {
                        if(result) {
                            this.addRemoteStream(room_id, name);
                        } else {
                            console.log('deney view request');
                        }
                        fn2(result);                        
                    })
                } else {
                    this.addRemoteStream(room_id, name);
                }
            }
        }
    }

    addRemoteStream(room_id, name) {
        let  audioTrack = null;
        let videoTrack = null;
        let socket_id = null;
        let locked = null;
        let consumersArr = Array.from(this.consumers.values());
        let roomConsumers = consumersArr.filter((item) => (item.room_id === room_id && item.name === name));
        roomConsumers.forEach((item) => {
            if(item.kind === 'video') {
                locked = item.locked;
                videoTrack = item.consumer.track;
                socket_id = item.socket_id
            } else if(item.kind === 'audio'){
                audioTrack = item.consumer.track;
            }
        })
        if(videoTrack && socket_id) {
            console.log('add remote stream', videoTrack, roomConsumers)
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
                            socket_id,
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
                        socket_id,
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
                    socket_id,
                    name,
                    time
                });
                this.remoteStreams.set(room_id, newRoomStreams);
            }
            mediaSocket.emit('start view', {
                room_id,
                name: this.name,
                socket_id
            });
            this.event(_EVENTS.onChangeRemoteStreams, {room_id});
        }
    }

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
                console.log(roomStreams.values());
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
        console.log('remove room producers', room_id);
    }

    closeProducer(type, room_id) {
        let label = this.producerLabels.get(room_id)
        if(!label) {
            console.log('there is no producer for this room ' + room_id);
            this.producerLabels.delete(room_id);
            this.viewers.delete(room_id);
            this.localStreams.delete(room_id);
            this.event(_EVENTS.stopStream, {room_id});
            this.event(_EVENTS.changeViewers, {room_id});
            return;

        }
        if(type === 'audio') {
            let producer_id = label['audio'];
            let producerInfo = this.producers.get(producer_id);
            if(!producerInfo) {
                console.log('there is no producer for this id');
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
            mediaSocket.emit('roomProducersClosed', {
                room_id
            });
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
            this.localStreams.delete(room_id);
            this.event(_EVENTS.onChangeProduce, {room_id, type: 'close'});
            this.event(_EVENTS.changeViewers, {room_id});
            this.event(_EVENTS.stopStream, {room_id});
        }
    }

    pauseProducer(room_id) {
        if (!this.producerLabels.has(room_id)) {
            console.log('there is no producer for this type ' + room_id)
            return
        }
        let label = this.producerLabels.get(room_id);
        if(label) {
            let {audio: audioId, video: videoId} = label;
            if(audioId) {
                let audioProducer = this.producers.get(audioId);
                if(audioProducer && audioProducer.producer) {
                    audioProducer.producer.pause();
                }
            }
            if(videoId) {
                let videoProducer = this.producers.get(videoId);
                if(videoProducer && videoProducer.producer) {
                    videoProducer.producer.pause();
                }
            }
        }
        

    }

    resumeProducer(room_id) {
        if (!this.producerLabels.has(room_id)) {
            console.log('there is no producer for this type ' + room_id)
            return
        }
        let label = this.producerLabels.get(room_id);
        if(label) {
            let {audio: audioId, video: videoId} = label;
            if(audioId) {
                let audioProducer = this.producers.get(audioId);
                if(audioProducer && audioProducer.producer) {
                    audioProducer.producer.resume();
                }
            }
            if(videoId) {
                let videoProducer = this.producers.get(videoId);
                if(videoProducer && videoProducer.producer) {
                    videoProducer.producer.resume();
                }
            }
        }
    }

    closeRemoteStream(room_id, name) {

    }

    closeConsumer(consumer_id, room_id) {
        let consumerInfo = this.consumers.get(consumer_id);
        if(consumerInfo) {
            let {kind, room_id, name, socket_id, consumer} = consumerInfo;
            consumer.close();
            this.removeRemoteStream(name, kind, room_id)
            this.consumers.delete(consumer_id);
            this.event(_EVENTS.onChangeConsume, {room_id})
        }
    }

    removeConsumer(consumer_id, room_id) {
        // let elem = document.getElementById(consumer_id)
        // elem.srcObject.getTracks().forEach(function (track) {
        //     track.stop()
        // })
        // elem.parentNode.removeChild(elem)
        let consumerInfo = this.consumers.get(consumer_id);
        if(consumerInfo) {
            let {kind, room_id, name, socket_id} = consumerInfo;
            this.removeRemoteStream(name, kind, room_id)
            
            this.consumers.delete(consumer_id);
            this.event(_EVENTS.onChangeConsume, {room_id})
        }
        // this.event(_EVENTS.onChangeConsume, {room_id})
    }

    removeRemoteStream(name, kind, room_id) {
        let roomStreams = this.remoteStreams.get(room_id);
        if(roomStreams && roomStreams.has(name)) {
            let {stream, socket_id} = roomStreams.get(name);
            if(stream) {
                if(kind === 'audio') {
                    // let audioTracks = stream.getAudioTracks();
                    // if(audioTracks && audioTracks.length > 0) {
                    //     audioTracks[0].stop();
                    // }
                } else {
                    // stream.getTracks().forEach((track) => {
                    //     track.stop();
                    // });
                    roomStreams.delete(name);
                    mediaSocket.emit('stop view', {
                        room_id,
                        name: this.name,
                        socket_id
                    })
                }
                this.event(_EVENTS.onChangeRemoteStreams, {room_id})
            }
        }
    }

    stopView(room_id, targetId, name) {
        let roomStreams = this.remoteStreams.get(room_id);
        console.log('stop view', room_id, targetId, name, roomStreams);
        mediaSocket.request('stop broadcast', {
            room_id,
            name: this.name,
            targetName: name,
        })
    }
 
    exit(offline = false) {
        console.log('mediasoup exit')
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
                console.log('close producers', this.producers)
                this.producers.forEach((producerInfo) => {
                    if(producerInfo && producerInfo.producer) {
                        producerInfo.producer.close();
                    }
                })
            }
                
            // mediaSocket.off('disconnect')
            mediaSocket.off('newProducers')
            mediaSocket.off('consumerClosed')
        }.bind(this)

        if (!offline) {
            mediaSocket.request('exit').then(e => console.log(e)).catch(e => console.warn(e)).finally(function () {
                clean()
            }.bind(this))
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

    startStream(room_id, stream, locked) {
        if(this.localStreams.has(room_id)) {
            let {stream} = this.localStreams.get(room_id);
            stream.getTracks().forEach((track) => {
                track.stop()
            });
            this.localStreams.delete(room_id);
        }
        this.localStreams.set(room_id, {
            stream,
            locked
        });
        this.event(_EVENTS.startStream, {room_id});
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
        console.log('delete viewer', room_id, 'name: ', name)
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
            console.log('get remote streams', streams)
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