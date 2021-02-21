const {
  validateLoginCredentials,
  getUserByNickname,
  checkPassword,
  createToken,
  updateIp,
} = require('../../utils');

const login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    let ipAddress = req.userIp;
    await validateLoginCredentials({ username, password });

    const user = await getUserByNickname(username);

    await checkPassword(password, user.password);
    await updateIp(user._id, ipAddress);

    const token = await createToken(user._id, user.role);

    res
      .cookie('token', token)
      .status(200)
      .json({ statusCode: 200, message: 'logged in successfully' });
  } catch (err) {
    console.log(err)
    next(err);
  }
};

module.exports = login;
