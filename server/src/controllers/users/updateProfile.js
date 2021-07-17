const { Users } = require('../../database/models')
const path = require("path")
const randomString = require('random-string');
const { getIO } = require('../../io');
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
    const { username, aboutMe, avatarType } = req.body;
    
    try {
        const io = getIO();
        if (username && aboutMe && aboutMe !== '') {
            await Users.updateOne({username}, { aboutMe });
        }
        if (avatarType === 'true') {
            if (username && req.files && req.files.avatar) {
                const avatarImage = req.files.avatar;
                const newAvatarFileName = getFileName("avatar_", avatarImage.name);
                await avatarImage.mv(path.join(__dirname, '..', '..', '..', '..', 'client', 'public/img/avatar/', newAvatarFileName))
                // await avatarImage.mv(path.join(__dirname, '..', '..', '..', '..', 'client', 'build/img/avatar/', newAvatarFileName))
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
                io.emit('update user info', {
                    username,
                    avatarObj: avatar,
                    currentAvatar: 'default',
                    aboutMe: user.aboutMe
                })
            } else {
                await Users.updateOne({username}, {
                    currentAvatar: 'default'
                });
                const user = await Users.findOne({username});
                let avatar = {}
                if (user && user.avatarObj) {
                    avatar = user.avatarObj;
                }
                io.emit('update user info', {
                    username,
                    avatarObj: avatar,
                    currentAvatar: user.currentAvatar,
                    aboutMe: user.aboutMe
                })
            }
        } else {
            await Users.updateOne({ username }, {
                currentAvatar: 'joomula'
            });
            const user = await Users.findOne({username});
            let avatar = {}
            if (user && user.avatarObj) {
                avatar = user.avatarObj;
            }
            console.log('joomular avatar')
            io.emit('update user info', {
                username,
                currentAvatar: 'joomula',
                avatarObj: avatar,
                aboutMe: user.aboutMe
            })
        }
        res
        .status(204)
        .json({})
    } catch (err) {
        console.log(err);
    }
}

module.exports = updateProfile;