const db = require('../../database/serverDbConnection');
const bcrypt = require('bcrypt');
const checkUserFromServer = async (username, password) => {
    return new Promise((resolve, reject) => {
        let sql = "SELECT a.id, a.username, a.password, IF(ISNULL(b.value), 'male', b.value) as gender, c.group_id as top_group, IF(ISNULL(d.thumb), '', d.thumb) as thumb ";
          sql += 'FROM ixt0j_users a ';
          sql += 'LEFT JOIN ixt0j_community_fields_values b ON a.id = b.user_id AND b.field_id = 2 ';
          sql += 'LEFT JOIN ixt0j_user_usergroup_map c ON a.id = c.user_id ';
          sql += 'LEFT JOIN ixt0j_community_users d ON a.id = d.userid ';
          sql += 'WHERE a.username = ? ORDER BY c.group_id DESC LIMIT 1';
        let last_user = await db.query(sql, username);
           
        let user = last_user[0];
        if (last_user.length !== 0) {
            const pwd = user.password.replace("$2y$", "$2a$");
            if (!bcrypt.compareSync(password, pwd) && !bcrypt.compareSync(password, user.password)) {
                return reject('password_error');
            }
            if (user.block) {
                return reject('confirm_error');
            }
            return resolve(user);
        } else {
            return reject('username_error');
        }
    });
}

module.exports = checkUserFromServer;