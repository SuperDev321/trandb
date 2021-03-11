const db = require('../../database/serverDbConnection');
const checkUserFromServer = async (username) => {
    return new Promise((resolve, reject) => {
        let sql = "SELECT a.id, a.username WHERE a.username = ?";
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