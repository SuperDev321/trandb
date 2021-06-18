const { Users } = require('../../database/models')
const path = require("path")
const randomString = require('random-string')
function getFileName(prefix, filename) {
    var ext = path.extname(filename)
    var newFileName = randomString({
      length: 8,
      numeric: true,
      letters: true,
      special: false
    });
    newFileName += ext
    return prefix + newFileName;
}

const updateProfile = async (req, res, next) => {
    const { username } = req.body;

    if (username && req.files && req.files.avatar) {
        const avatarImage = req.files.avatar;
        var newAvatarFileName = getFileName("avatar_", avatarImage.name);
        try {
            await avatarImage.mv(path.join(__dirname, '..', '..', '..', '..', 'client', 'public/img/avatar/', newAvatarFileName))
            var avatarUrl =  "img/avatar/" + newAvatarFileName;
            await Users.updateOne({username}, {avatar: newAvatarFileName});
            res
            .status(200)
            .json({
                avatarUrl
            })
        } catch (err) {
          console.log(err);
        }
    }
}

module.exports = updateProfile;