const db = require('../../database/serverDbConnection');
const checkUserFromServer = async (username) => {
    return new Promise((resolve, reject) => {
        let sql = "SELECT username FROM ixt0j_users WHERE username = ? LIMIT 1";
        db.query(sql, username, function(err, last_user) {
            if(err) {
                return reject('db_error');
            }
            if (last_user.length !== 0) {
                return resolve(true);
            } else {
                return resolve(false);
            }
        });
           
        
    });
}

module.exports = checkUserFromServer;