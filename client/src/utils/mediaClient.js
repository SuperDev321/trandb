import { LabelRounded, ViewStreamSharp } from '@material-ui/icons';
import * as mediasoupClient from 'mediasoup-client';
import {mediaSocket as socket} from './socketHandler';

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
    onChangeConsume: 'onChangeConsume',
    onChangeProduce: 'onChangeProduce'
}



class MediaClient {

    constructor(name, successCallback = null) {
        this.name = name
        this.producerTransports = new Map();
        this.consumerTransports = new Map();
        this.devices = new Map();
        this.room_id = null;

        this.consumers = new Map()
        this.producers = new Map()

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
        this.initSockets();
        this._isOpen = true;
        // this.createRoom(room_id).then(async function () {
        //     await this.join(name, room_id)
        //     console.log('joined room', room_id, name)
        //     this.initSockets()
        //     this._isOpen = true
        //     // successCallback()
        // }.bind(this))
    }

    ////////// INIT /////////

    async createRoom(room_id) {
        await socket.request('createRoom', {
            room_id
        }).catch(err => {
            console.log(err)
        })
    }

    async join(room_id) {
        try {
            let result = await socket.request('join', {
                name: this.name,
                room_id
            });
            console.log(result);
            const data = await socket.request('getRouterRtpCapabilities', room_id);
            let device = await this.loadDevice(data)
            this.devices.set(room_id, device);
            await this.initTransports(device, room_id)
            
            socket.emit('getProducers', room_id)
        } catch (e) {
            console.log(e);
        }
        console.log('joined room ', room_id)
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
            const data = await socket.request('createWebRtcTransport', {
                forceTcp: false,
                rtpCapabilities: device.rtpCapabilities,
                room_id
            })
            if (data.error) {
                console.error(data.error);
                return;
            }

            let producerTransport = device.createSendTransport(data);
            this.producerTransports.set(room_id, producerTransport);

            producerTransport.on('connect', async ({
                dtlsParameters
            }, callback, errback) => {
                socket.request('connectTransport', {
                    dtlsParameters,
                    transport_id: data.id,
                    room_id
                })
                .then(callback)
                .catch(errback)
            });

            producerTransport.on('produce', async ({
                kind,
                rtpParameters
            }, callback, errback) => {
                try {
                    const {
                        producer_id
                    } = await socket.request('produce', {
                        producerTransportId: producerTransport.id,
                        kind,
                        rtpParameters,
                        room_id,
                        name: this.name
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
            const data = await socket.request('createWebRtcTransport', {
                forceTcp: false,
                room_id
            });
            if (data.error) {
                console.error(data.error);
                return;
            }

            // only one needed
            let consumerTransport = await device.createRecvTransport(data);
            
            consumerTransport.on('connect', function ({
                dtlsParameters
            }, callback, errback) {
                console.log('cosumer transport connect request', socket);
                socket.request('connectTransport', {
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
                        //await socket.request('resume');
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
        console.log('init done');
    }

    initSockets() {
        socket.on('consumerClosed', function ({
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
        socket.on('newProducers', async function (data) {
            console.log('new producers', data)
            for (let {
                    producer_id,
                    producer_name,
                    room_id
                } of data) {
                await this.consume(producer_id, producer_name, room_id);
            }
        }.bind(this))

        socket.on('disconnect' ,function () {
            this.exit(true)
        }.bind(this))


    }




    //////// MAIN FUNCTIONS /////////////


    async produce(room_id, videoDeviceId = null ,audioDeviceId = null) {
        
        let mediaConstraints = {}
        mediaConstraints = {
            audio: audioDeviceId? {
                deviceId: audioDeviceId
            }: false,
            video: videoDeviceId? {
                deviceId: videoDeviceId,
                width: {
                    min: 640,
                    ideal: 1920
                },
                height: {
                    min: 400,
                    ideal: 1080
                },
            }: false
        }
        // let audio = false
        // switch (type) {
        //     case mediaType.audio:
        //         mediaConstraints = {
        //             audio: {
        //                 deviceId: deviceId
        //             },
        //             video: false
        //         }
        //         audio = true
        //         break
        //     case mediaType.video:
        //         mediaConstraints = {
        //             audio: false,
        //             video: {
        //                 width: {
        //                     min: 640,
        //                     ideal: 1920
        //                 },
        //                 height: {
        //                     min: 400,
        //                     ideal: 1080
        //                 },
        //                 deviceId: deviceId
        //                 /*aspectRatio: {
        //                     ideal: 1.7777777778
        //                 }*/
        //             }
        //         }
        //         break
        //     default:
        //         return
        // }
        console.log(this.devices)
        let device = this.devices.get(room_id);
        if(!device) {
            console.error('cannot find device');
            return;
        }
        if (!device.canProduce('video')) {
            console.error('cannot produce video');
            return;
        }
        let stream;
        try {
            stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
            // console.log(navigator.mediaDevices.getSupportedConstraints())

            const videoTrack = stream.getVideoTracks()[0];
            const videoParams = {
                track: videoTrack
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
                }
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
                    videoGoogleStartBitrate: 1000
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
                video: videoProducer? videoProducer.id: null
            })
            console.log('start local stream', stream)
            this.startStream(room_id, stream);
            // this.event(_EVENTS.onChangeProduce, {type: 'start', room_id});
        } catch (err) {
            console.log(err)
        }
    }

    async consume(producer_id, producer_name, room_id) {
        this.getConsumer(producer_id, room_id).then((data) => {
            if(!data) return;
            let {
                consumer,
                kind,
                name
            } = data;
            consumer.on('trackended', ()  => {
                console.log('remote consumer track ended')
                this.removeConsumer(consumer.id)
            })
            consumer.on('transportclose', ()  => {
                console.log('remote consumer track transport close')
                this.removeConsumer(consumer.id)
            })
            this.addConsumer(room_id, producer_name, kind, consumer);
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
        const data = await socket.request('consume', {
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

    async addConsumer(room_id, name, kind, consumer) {
        this.consumers.set(consumer.id, {
            consumer,
            kind,
            room_id,
            name
        });
        const track = consumer.track;
        
        if(this.remoteStreams.has(room_id)) {
            const roomStreams = this.remoteStreams.get(room_id);
            if(roomStreams.has(name)) {
                let streamSet = roomStreams.get(name);
                if(streamSet && streamSet[kind]) {
                    streamSet[kind].addTrack(track);
                } else {
                    const stream = new MediaStream();
                    stream.addTrack(track);
                    if(!streamSet) {
                        streamSet = {};
                    }
                    streamSet[kind] = stream;
                    roomStreams.set(name, streamSet);
                }
                
            } else {
                const stream = new MediaStream();
                stream.addTrack(track);
                const streamSet = {};
                streamSet[kind] = stream;
                roomStreams.set(name, streamSet);
            }
        } else {
            const stream = new MediaStream();
            stream.addTrack(track);
            const newRoomStreams = new Map();
            const streamSet = {};
            streamSet[kind] = stream;
            newRoomStreams.set(name, streamSet);
            this.remoteStreams.set(room_id, newRoomStreams);
        }
        this.event(_EVENTS.onChangeConsume, {room_id});

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
        this.event(_EVENTS.onChangeProduce, {room_id, type: 'close'});
    }

    closeProducer(type, room_id) {
        // if (!this.producerLabel.has(type)) {
        //     console.log('there is no producer for this type ' + type)
        //     return
        // }
        // let producer_id = this.producerLabel.get(type)
        let label = this.producerLabels.get(room_id)
        if(!label) {
            console.log('there is no producer for this room ' + room_id);
        }
        if(type === 'audio') {
            let producer_id = label['audio'];
            let producerInfo = this.producers.get(producer_id);
            if(!producerInfo) {
                console.log('there is no producer for this id');
                return;
            }
            socket.emit('producerClosed', {
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
            socket.emit('roomProducersClosed', {
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
            this.event(_EVENTS.onChangeProduce, {room_id, type: 'close'});
        }
        
        // switch (type) {
        //     case mediaType.audio:
        //         this.event(_EVENTS.stopAudio)
        //         break
        //     case mediaType.video:
        //         this.event(_EVENTS.stopVideo)
        //         break
        //     case mediaType.screen:
        //         this.event(_EVENTS.stopScreen)
        //         break;
        //     default:
        //         return
        // }

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

    removeConsumer(consumer_id, room_id) {
        // let elem = document.getElementById(consumer_id)
        // elem.srcObject.getTracks().forEach(function (track) {
        //     track.stop()
        // })
        // elem.parentNode.removeChild(elem)

        this.consumers.delete(consumer_id);
        // this.event(_EVENTS.onChangeConsume, {room_id})
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
                
            socket.off('disconnect')
            socket.off('newProducers')
            socket.off('consumerClosed')
        }.bind(this)

        if (!offline) {
            socket.request('exitRoom', this.room_id).then(e => console.log(e)).catch(e => console.warn(e)).finally(function () {
                clean()
            }.bind(this))
        } else {
            clean()
        }
        this.event(_EVENTS.exitRoom)
    }

    ///////  HELPERS //////////

    async roomInfo() {
        let info = await socket.request('getMyRoomInfo', this.room_id)
        return info
    }

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

    startStream(room_id, stream) {
        if(this.localStreams.has(room_id)) {
            let stream = this.localStreams.get(room_id);
            stream.getTracks().forEach((track) => {
                track.stop()
            });
            this.localStreams.delete(room_id);
        }
        this.localStreams.set(room_id, stream);
        this.event(_EVENTS.startStream, {room_id});
    }

    getRemoteStreams(room_id) {
        
        if(this.remoteStreams.has(room_id)) {
            let roomStreams = this.remoteStreams.get(room_id);
            let streamSets = [];
            roomStreams.forEach((value, key) => {
                streamSets.push({
                    name: key,
                    streamSet: value
                })
            })
            console.log('get remote streams', streamSets);
            return streamSets;
        } else {
            return [];
        }
        // let consumers = Array.from(this.consumers.values());
        // // let roomConsmers = consumers.filter((item) => (item.room_id === room_id));
        // // let streams = consumers.map(({stream, kind, room_id, name}) => ({stream, kind, room_id, name}));
        // let videoConsumers = consumers.filter((item)=> (item.room_id === room_id && item.kind === 'video'));
        // console.log('remote consumers', consumers)
        // let newStreams = videoConsumers.map(({consumer, name}) => {
        //     const newStream = new MediaStream();
        //     let audioConsumerInfo = consumers.find((item) => (item.room_id === room_id && item.name === name && item.kind === 'audio'));
            
        //     if(audioConsumerInfo && audioConsumerInfo.consumer) {
        //         console.log('sound track',audioConsumerInfo.consumer.track );
        //         newStream.addTrack(audioConsumerInfo.consumer.track);
        //     }
        //     let videoTrack = consumer.track;
        //     newStream.addTrack(videoTrack);
        //     return {
        //         stream: newStream,
        //         name,
        //     }
        // })
        // return newStreams;
        // if(this.remoteStreams.has(room_id)) {
        //     this.remoteStreams.forEach((value, key) => {
        //         let {stream} = value;
        //         stream.getTracks().forEach((track) => {
        //             track.stop()
        //         });
        //     });
        //     this.remoteStreams.clear();
        // }
    }

    getLocalStream (room_id) {
        // let label = this.producerLabels.get(room_id);
        
        // if(label) {
        //     let videoId= label.video;
        //     let audioId = label.audio;
        //     console.log('get local stream', videoId, audioId, this.producers)
        //     let videoProducerInfo = this.producers.get(videoId);
        //     if(!videoProducerInfo || !videoProducerInfo.producer) {
        //         return null;
        //     }
        //     let videoTrack = videoProducerInfo.producer.track;
        //     let stream = new MediaStream();
        //     stream.addTrack(videoTrack);

        //     if(audioId) {
        //         let audioProducerInfo = this.producers.get(audioId);
        //         console.log('add sound track', audioProducerInfo)
        //         if(audioProducerInfo && audioProducerInfo.producer) {
                    
        //             stream.addTrack(audioProducerInfo.producer.track);
        //         }
        //     }
        //     return stream;
        // }
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