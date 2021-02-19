const {
    getGuest,
    createUser,
    createToken,
    isForbidden
} = require('../../utils');
  
const guestLogin = async (req, res, next) => {
    const { nickname, gender } = req.body;
    try {
        let forbidden = await isForbidden(nickname);
        if(forbidden) {
            return res
                    .status(400)
                    .json({
                        error: 'Bad request',
                        message: 'This nickname is not allowed'
                    })
        }
        let user = await getGuest(nickname, gender);
        if(!user)
            user = await createUser({ username: nickname, role: 'guest', gender });
            console.log('created token')
        const token = await createToken(user._id, 'guest');
        console.log('created token', token)

        res
            .cookie('token', token)
            .status(200)
            .json({ statusCode: 200, message: 'login with guest successfully' });
    } catch (err) {
        console.log(err)
        next(err);
    }
};
  
module.exports = guestLogin;
  