const fs = require('fs');

class LogManager {
    constructor () {

    }

    async saveLogInfo (ip, username, role, logType, reason = '') {
        const date = new Date();
        let user_info = `Ip : ${ip}`;
        user_info += `, Username : ${username}`;
        user_info += `, Member type : ${role}`;
        user_info += `, ${logType} `;
        user_info += `, ${reason} : ${date.toUTCString()}\r\n`;
        const file_name = `./logs/${date.getFullYear()}-${String(date.getMonth() + 1)}-${date.getDate()}.txt`;
        console.log(file_name)
        fs.open(file_name, 'a+', (e, file) => {
            console.log(e, file)
            fs.appendFile(file, user_info, {flag: 'w+'}, () => {
                fs.close(file, function () {
                    // console.log('file closed');
                });
            });
        });
    }
}

const LogMan = new LogManager();

module.exports = LogMan;