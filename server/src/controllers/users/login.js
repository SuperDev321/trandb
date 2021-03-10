const { Users } = require('../../database/models');
const {
  validateLoginCredentials,
  getUserByNickname,
  checkPassword,
  createToken,
  updateIp,
} = require('../../utils');
const checkUserFromServer = require('../../utils/user/checkUserFromServer');

const login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    let ipAddress = req.userIp;
    await validateLoginCredentials({ username, password });

    let user = await checkUserFromServer(username, password);
    if(user) {
      
      let currentUser = await getUserByNickname(username);
      if(!currentUser) {
        currentUser = await Users.create({username, password, role: user.role, gender: user.gender});
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
    console.log(err)
    next(err);
  }
};

module.exports = login;
