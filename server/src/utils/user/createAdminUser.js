const bcrypt = require('bcrypt');

const { Users } = require('../../database/models');

const createAdminUser = async ({ username, email, password, gender }) => {
    let hashedPassword = null;
    if(password)
        hashedPassword = await bcrypt.hash(password, 10);
    let oldUser = await Users.findOne({ $or: [
            {username},
            {email}
        ]
    });
    if(!oldUser)
        await Users.create({ username, email, password: hashedPassword, role: 'admin', gender });
};

module.exports = createAdminUser;
