import axios from 'axios';
import config from '../config';

const getRouterRtpCapabilities = async (room_id) => {
    return new Promise((resolve, reject) => {
        axios.get(`${config.media_server_url}/api/getRouterRtpCapabilities/`+room_id)
        .then((res) => {
            if (res.status === 200) {
                const { data } = res.data;
                resolve(data);
            } else {
                reject('error');
            }
        })
        .catch((err) => {
            reject(err);
        })
       
    })
};

const createMediaRoom = async (room_id) => {
    return new Promise((resolve, reject) => {
        axios.post(`${config.media_server_url}/api/createMediaRoom`, {
            room_id,
            token: config.media_token,
        })
        .then((res) => {
            if (res.status === 200) {
                const { data } = res.data;
                resolve(data);
            } else {
                reject('error');
            }
        })
        .catch((err) => {
            reject(err);
        })
    })
};

const joinMedia = async (room_id, name, userId) => {
    return new Promise((resolve, reject) => {
        axios.post(`${config.media_server_url}/api/joinMedia`, {
            name,
            room_id,
            token: config.media_token,
            userId
        })
        .then((res) => {
            if (res.status === 200) {
                const { data } = res.data;
                resolve(data);
            } else {
                reject('error');
            }
        })
        .catch((err) => {
            reject(err);
        })
    })
};

const createWebRtcTransport = async (forceTcp, rtpCapabilities, room_id, userId) => {
    return new Promise((resolve, reject) => {
        axios.post(`${config.media_server_url}/api/createWebRtcTransport`, {
            room_id,
            token: config.media_token,
            forceTcp,
            rtpCapabilities,
            userId
        })
        .then((res) => {
            if (res.status === 200) {
                const { data } = res.data;
                resolve(data);
            } else {
                reject('error');
            }
        })
        .catch((err) => {
            reject(err);
        })
    })
};

const connectTransport = async (dtlsParameters, transport_id, room_id, userId) => {
    return new Promise((resolve, reject) => {
        axios.post(`${config.media_server_url}/api/connectTransport`, {
            dtlsParameters,
            transport_id,
            room_id,
            userId,
            token: config.media_token
        })
        .then((res) => {
            if (res.status === 200) {
                const { data } = res.data;
                resolve(data);
            } else {
                reject('error');
            }
        })
        .catch((err) => {
            reject(err);
        })
    })
};

const produce = async (producerTransportId, kind, rtpParameters, room_id, name, userId, locked) => {
    return new Promise((resolve, reject) => {
        axios.post(`${config.media_server_url}/api/produce`, {
            producerTransportId,
            kind,
            rtpParameters,
            room_id,
            name,
            userId,
            locked
        })
        .then((res) => {
            if (res.status === 200) {
                const { data } = res.data;
                resolve(data);
            } else {
                reject('error');
            }
        })
        .catch((err) => {
            reject(err);
        })
    })
};

const consume = async (consumerTransportId, rtpCapabilities, producerId, room_id, userId) => {
    return new Promise((resolve, reject) => {
        axios.post(`${config.media_server_url}/api/consume`, {
            rtpCapabilities,
            consumerTransportId, // might be 
            producerId,
            userId,
            room_id
        })
        .then((res) => {
            if (res.status === 200) {
                const { data } = res.data;
                resolve(data);
            } else {
                reject('error');
            }
        })
        .catch((err) => {
            reject(err);
        })
    })
};

const producerClosed = async (producer_id, room_id, userId) => {
    return new Promise((resolve, reject) => {
        axios.post(`${config.media_server_url}/api/producerClosed`, {
            producer_id,
            room_id,
            userId
        })
        .then((res) => {
            if (res.status === 200) {
                const { data } = res.data;
                resolve(data);
            } else {
                reject('error');
            }
        })
        .catch((err) => {
            reject(err);
        })
    })
};

const roomProducersClosed = async (room_id, userId) => {
    return new Promise((resolve, reject) => {
        axios.post(`${config.media_server_url}/api/roomProducersClosed`, {
            room_id,
            userId
        })
        .then((res) => {
            if (res.status === 200) {
                const { data } = res.data;
                resolve(data);
            } else {
                reject('error');
            }
        })
        .catch((err) => {
            reject(err);
        })
    })
};

export {
    getRouterRtpCapabilities,
    createMediaRoom,
    joinMedia,
    createWebRtcTransport,
    connectTransport,
    produce,
    consume,
    producerClosed,
    roomProducersClosed
};