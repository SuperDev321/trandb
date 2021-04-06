import { LabelRounded } from '@material-ui/icons';
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

        this.remoteStreams = [];
        this.localStream = null;

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
        socket.request('join', {
            name: this.name,
            room_id
        }).then(async (e) => {
            console.log(e)
            const data = await socket.request('getRouterRtpCapabilities', room_id);
            let device = await this.loadDevice(data)
            this.devices.set(room_id, device);
            await this.initTransports(device, room_id)
            socket.emit('getProducers', room_id)
        }).catch(e => {
            console.log(e)
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
            this.consumerTransports.set(room_id, consumerTransport);
            consumerTransport.on('connect', function ({
                dtlsParameters
            }, callback, errback) {
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
        }

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
                await this.consume(producer_id, producer_name, room_id)
            }
        }.bind(this))

        socket.on('disconnect' ,function () {
            this.exit(true)
        }.bind(this))


    }




    //////// MAIN FUNCTIONS /////////////


    async produce(type, room_id, deviceId = null) {
        
        let mediaConstraints = {}
        let audio = false
        switch (type) {
            case mediaType.audio:
                mediaConstraints = {
                    audio: {
                        deviceId: deviceId
                    },
                    video: false
                }
                audio = true
                break
            case mediaType.video:
                mediaConstraints = {
                    audio: false,
                    video: {
                        width: {
                            min: 640,
                            ideal: 1920
                        },
                        height: {
                            min: 400,
                            ideal: 1080
                        },
                        deviceId: deviceId
                        /*aspectRatio: {
                            ideal: 1.7777777778
                        }*/
                    }
                }
                break
            default:
                return
        }
        console.log('produce1', type, room_id, deviceId)
        let device = this.devices.get(room_id);
        console.log('produce2', type, room_id, deviceId)
        if(!device) {
            console.error('cannot find device');
            return;
        }
        console.log('produce3', type, room_id, deviceId)
        if (!device.canProduce('video') && !audio) {
            console.error('cannot produce video');
            return;
        }
        console.log('produce4', type, room_id, deviceId)
        // if (this.producerLabel.has(type)) {
        //     console.log('producer already exists for this type ' + type)
        //     return
        // }
        console.log('mediacontraints:',mediaConstraints)
        let stream;
        try {
            stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
            console.log(navigator.mediaDevices.getSupportedConstraints())

            const track = audio ? stream.getAudioTracks()[0] : stream.getVideoTracks()[0]
            const params = {
                track
            };
            if (!audio) {
                params.encodings = [{
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
                params.codecOptions = {
                    videoGoogleStartBitrate: 1000
                };
            }

            let producerTransport = this.producerTransports.get(room_id);
            if(!producerTransport) return;
            let producer = await producerTransport.produce(params)

            this.producers.set(producer.id, {
                producer,
                room_id,
                type
            })

            let label = this.producerLabels.get(room_id);
            if(label) {
                if(type === mediaType.audio) {
                    this.producerLabels.set(room_id, {
                        audio: producer.id,
                        ...label
                    })
                } else {
                    this.producerLabels.set(room_id, {
                        video: producer.id,
                        ...label
                    })
                }
                
            } else {
                if(type === mediaType.audio) {
                    this.producerLabels.set(room_id, {
                        audio: producer.id,
                    })
                } else {
                    this.producerLabels.set(room_id, {
                        video: producer.id,
                    })
                }
            }

            producer.on('trackended', () => {
                this.closeProducer(producer.id, room_id)
            })

            producer.on('transportclose', () => {
                console.log('producer transport close')
                // if (!audio) {
                //     elem.srcObject.getTracks().forEach(function (track) {
                //         track.stop()
                //     })
                //     elem.parentNode.removeChild(elem)
                // }
                
                if(!audio) {
                    this.removeRoomProducers(room_id);
                } else {
                    this.producers.delete(producer.id);
                    this.event(_EVENTS.onChangeProduce, 'audio close');
                }
            })

            producer.on('close', () => {
                console.log('closing producer')
                // if (!audio) {
                //     elem.srcObject.getTracks().forEach(function (track) {
                //         track.stop()
                //     })
                //     elem.parentNode.removeChild(elem)
                // }
                if(!audio) {
                    this.removeRoomProducers(room_id);
                } else {
                    this.producers.delete(producer.id);
                    this.event(_EVENTS.onChangeProduce, 'audio close');
                }
            })
            this.event(_EVENTS.onChangeProduce, {type: 'start', room_id});
            // this.producerLabel.set(type, this.producer.id)

            // switch (type) {
            //     case mediaType.audio:
            //         this.event(_EVENTS.startAudio, {room_id})
            //         break
            //     case mediaType.video:
            //         this.event(_EVENTS.startVideo, {room_id});
            //         break
            //     default:
            //         return
            //         break;
            // }
        } catch (err) {
            console.log(err)
        }
    }

    async consume(producer_id, producer_name, room_id) {
        this.getConsumeStream(producer_id, room_id).then(function (data) {
            if(!data) return;
            let {
                consumer,
                kind,
                name
            } = data;
            this.consumers.set(consumer.id, {
                consumer,
                kind,
                room_id,
                name
            })
            consumer.on('trackended', function () {
                this.removeConsumer(consumer.id)
            }.bind(this))
            consumer.on('transportclose', function () {
                this.removeConsumer(consumer.id)
            }.bind(this))
            this.event(_EVENTS.onChangeConsume, {room_id});
        }.bind(this))
    }

    async getConsumeStream(producerId, room_id) {
        let device = await this.devices.get(room_id);
        let consumerTransport = await this.consumerTransports.get(room_id);
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
        const stream = new MediaStream();
        stream.addTrack(consumer.track);
        return {
            consumer,
            stream,
            kind,
            name
        }
    }

    removeRoomProducers(room_id) {
        let label = this.producerLabels.get(room_id);
        if(!label) {
            console.log('there i no room ', room_id);
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

    pauseProducer(type) {
        if (!this.producerLabel.has(type)) {
            console.log('there is no producer for this type ' + type)
            return
        }
        let producer_id = this.producerLabel.get(type)
        this.producers.get(producer_id).pause()

    }

    resumeProducer(type) {
        if (!this.producerLabel.has(type)) {
            console.log('there is no producer for this type ' + type)
            return
        }
        let producer_id = this.producerLabel.get(type)
        this.producers.get(producer_id).resume()

    }

    removeConsumer(consumer_id, room_id) {
        // let elem = document.getElementById(consumer_id)
        // elem.srcObject.getTracks().forEach(function (track) {
        //     track.stop()
        // })
        // elem.parentNode.removeChild(elem)

        this.consumers.delete(consumer_id);
        this.event(_EVENTS.onChangeConsume, {room_id})
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

    getStreams() {
        let consumers = Array.from(this.consumers.values());
        // let roomConsmers = consumers.filter((item) => (item.room_id === room_id));
        // let streams = consumers.map(({stream, kind, room_id, name}) => ({stream, kind, room_id, name}));
        let videoConsumers = consumers.filter(({kind})=> (kind==='video'));

        let newStreams = videoConsumers.map(({consumer, name, room_id}) => {
            const newStream = new MediaStream();
            let audioConsumer = consumers.find((item) => (item.room_id === room_id && item.name === name));
            if(audioConsumer && audioConsumer.track) {
                newStream.addTrack(audioConsumer.track);
            }
            let videoTrack = consumer.track;
            newStream.addTrack(videoTrack);
            return {
                stream: newStream,
                room_id,
                name,
            }
        })
        console.log(newStreams);
        return newStreams;
    }

    getLocalStream (room_id) {
        let label = this.producerLabels.get(room_id);
        console.log('get local stream', label)
        if(label) {
            let videoId= label.video;
            let audioId = label.audio;
            let videoProducerInfo = this.producers.get(videoId);
            if(!videoProducerInfo || !videoProducerInfo.producer) {
                return null;
            }
            let videoTrack = videoProducerInfo.producer.track;
            let stream = new MediaStream();
            stream.addTrack(videoTrack);

            if(audioId) {
                let audioProducerInfo = this.producers.get(audioId);
                if(audioProducerInfo && audioProducerInfo.track) {
                    stream.addTrack(audioProducerInfo.track);
                }
            }
            return stream;
        }
        return null;
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