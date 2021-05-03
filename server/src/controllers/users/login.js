const { Users } = require('../../database/models');
const {
  validateLoginCredentials,
  getUserByNickname,
  checkPassword,
  createToken,
  updateIp,
} = require('../../utils');
const getUserFromServer = require('../../utils/user/getUserFromServer');

const login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    let ipAddress = req.userIp;
    await validateLoginCredentials({ username, password });

    let user = await getUserFromServer(username, password);
    if(user) {
      let currentUser = await getUserByNickname(username);
      if(!currentUser) {
        currentUser = await Users.create({username, password, role: user.role, gender: user.gender, avatar: user.avatar});
      } else {
        await Users.updateOne({username}, {password, role: user.role, gender: user.gender, avatar: user.avatar});
      }
      // await checkPassword(password, currentUser.password);
      await updateIp(currentUser._id, ipAddress);

      const token = await createToken(currentUser._id, currentUser.role);

      res
        .cookie('token', token)
        .status(200)
        .json({ statusCode: 200, message: 'logged in successfully' });
    }
  } catch (err) {
    console.log(err);
    if(err === 'confirm_error' || err === 'username_error' || err === 'password_error') {
      res
        .status(400)
        .json({  error: err });
    } else {
      res
        .status(404)
        .json({error: 'unknown_error'});
    }
  }
};

module.exports = login;
