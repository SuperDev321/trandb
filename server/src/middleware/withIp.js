const { createError } = require('../utils');
const isIp = require('is-ip');
const Address6 = require('ip-address').Address6;
const withIp = async (req, res, next) => {
    try {
        let ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress
        if(isIp(ip)) {
            if (ip.substr(0, 7) === '::ffff:') {
                ip = ip.substr(7);
            }
            if(!isIp.v4(ip)) {
                var address = new Address6(ip);
                var teredo = address.inspectTeredo();
                ip = teredo.client4;
            }
        } else {
            ip = '0.0.0.0';
        }
        req.userIp = ip;
        next();
    } catch(err) {
        const errResponse = createError(
            400,
            'Bad request',
            'you need to use ipv4 address'
        );
        return res.status(403).json(errResponse);
    }
};

module.exports = withIp;
