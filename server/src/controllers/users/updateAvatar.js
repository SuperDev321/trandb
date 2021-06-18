const { Users } = require('../../database/models');
const { getIO } = require('../../io');
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

const updateAvatar = async (req, res, next) => {
    const { type, username } = req.body;
    const io = getIO()
    // file upload and set self avatar
    if (type === 'true') {
        console.log(type, 'self')
        if (req.files && req.files.avatar) {
            const avatarImage = req.files.avatar;
            var newAvatarFileName = getFileName("avatar_", avatarImage.name);
            try {
                await avatarImage.mv(path.join(__dirname, '..', '..', '..', '..', 'client', 'public/img/avatar/', newAvatarFileName))
                const user = await Users.findOne({username});
                let avatar = {}
                if (user && user.avatarObj) {
                    avatar = user.avatarObj;
                }
                avatar.default = newAvatarFileName;
                await Users.updateOne({username}, {
                    avatarObj: avatar,
                    currentAvatar: 'default'
                });
                res
                .status(204)
                .json({
                })
                io.emit('update user info', {
                    username,
                    avatarObj: avatar,
                    currentAvatar: 'default'
                })
            } catch (err) {
              console.log(err);
            }
        } else {
            await Users.updateOne({username}, {
                currentAvatar: 'default'
            });
            io.emit('update user info', {
                username,
                currentAvatar: 'default'
            })
            res
            .status(204)
            .json({
            })
        }
    } else {
        await Users.updateOne({ username }, {
            currentAvatar: 'joomula'
        })
        io.emit('update user info', {
            username,
            currentAvatar: 'joomula'
        })
        res
        .status(204)
        .json({
        })
    }
}

module.exports = updateAvatar;