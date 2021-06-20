const { Users } = require('../../database/models');
const {
    getGuest,
    createUser,
    createToken,
    hasFobiddenWord,
    updateIp
} = require('../../utils');
const checkUserFromServer = require('../../utils/user/checkUserFromServer');
  
const guestLogin = async (req, res, next) => {
    const { nickname, gender, aboutMe } = req.body;
    const ipAddress = req.userIp;
    try {
        let isRegistered = await checkUserFromServer(nickname);
        if(isRegistered) {
            return res
            .status(400)
            .json({
                error: 'already_exist',
                message: 'This nickname is already registered.'
            });
        }
        let forbidden = await hasFobiddenWord(nickname);
        if(forbidden) {
            return res
                .status(400)
                .json({
                    error: 'forbidden',
                    message: 'This nickname is not allowed'
                })
        }
        let user = await getGuest(nickname);
        if(!user) {
            user = await createUser({ username: nickname, role: 'guest', gender, aboutMe });
        } else {
            if(user.isInChat) {
                for (let index = 0; ; index++) {
                    let newUsername = nickname + ' ('+ (index+1) + ')';
                    user = await getGuest(newUsername);
                    if(!user) {
                        user = await createUser({ username: newUsername, role: 'guest', gender, aboutMe });
                        break;
                    } else if(!user.isInChat) {
                        break;
                    } else {
                        continue;
                    }
                }
            } else {
                await Users.updateOne({username: nickname}, {gender, aboutMe});
                user = await getGuest(nickname);
            }
        }
        
        await updateIp(user._id, ipAddress);
        const token = await createToken(user._id, 'guest');

        res
            .cookie('token', token, {
                sameSite: 'none',
                secure: true,
                httpOnly: true,
                
            })
            .status(200)
            .json({ statusCode: 200, message: 'login with guest successfully', token });
    } catch (err) {
        next(err);
    }
};

module.exports = guestLogin;
  