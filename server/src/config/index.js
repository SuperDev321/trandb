require('dotenv').config();
const os = require('os');

const config = {
  db_host: process.env.PRO_DB,
  db_name: process.env.DB_NAME,
  ssl_key: process.env.SSL_KEY,
  ssl_cert: process.env.SSL_CERT,
  serverPort: process.env.SERVER_PORT,
  debugging_mode: false,
  server_image_path: 'img',
  VERSION: '1.0.50',
  // listenIp: '0.0.0.0',
  // listenPort: 3016,
  // sslCrt: '../ssl/cert.pem',
  // sslKey: '../ssl/key.pem',
  
  // mediasoup: {
  //   // Worker settings
  //   numWorkers : Object.keys(os.cpus()).length,
  //   worker: {
  //     rtcMinPort: 10000,
  //     rtcMaxPort: 10100,
  //     logLevel: 'warn',
  //     logTags: [
  //       'info',
  //       'ice',
  //       'dtls',
  //       'rtp',
  //       'srtp',
  //       'rtcp',
  //       // 'rtx',
  //       // 'bwe',
  //       // 'score',
  //       // 'simulcast',
  //       // 'svc'
  //     ],
  //   },
  //   // Router settings
  //   router: {
  //     mediaCodecs:
  //       [
  //         {
  //           kind: 'audio',
  //           mimeType: 'audio/opus',
  //           clockRate: 48000,
  //           channels: 2
  //         },
  //         {
  //           kind: 'video',
  //           mimeType: 'video/VP8',
  //           clockRate: 90000,
  //           parameters:
  //             {
  //               'x-google-start-bitrate': 1000
  //             }
  //         },
  //       ]
  //   },
  // // WebRtcTransport settings
  // webRtcTransport: {
  //     listenIps: [
  //       {
  //         ip: '0.0.0.0',      
  //         announcedIp:'192.168.30.128' // replace by public IP address
  //       }
  //     ],
  //     maxIncomingBitrate: 1500000,
  //     initialAvailableOutgoingBitrate: 1000000
  // },
  // }
};

module.exports = config;
