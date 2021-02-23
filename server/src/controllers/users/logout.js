const { removeUser } = require("../../utils");

const logout = async (req, res, next) => {
  try {
    
    let {_id, role} = req.userData;
    console.log('logout', _id, role)
    // if(role === 'guest' && _id) {
    //   await removeUser(_id);
    // }
    res.clearCookie('token').sendStatus(200);
  } catch (err) {
    console.log(err)
    next(err);
  }
};

module.exports = logout;
