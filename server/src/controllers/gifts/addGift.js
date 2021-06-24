const Gifts = require("../../database/models/Gifts");
const path = require("path");
const randomString = require('random-string');
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
const addGift = async (req, res, next) => {
    try {
        const { name, detail, cost } = req.body;
        console.log(name, detail, cost)
        if (req.files && req.files.gift_file) {
            var giftFile = req.files.gift_file;
            var newGiftFileName = getFileName("icon_", giftFile.name);
            try {
                await giftFile.mv(path.join(__dirname, '..', '..', '..', '..', 'client', 'build/gifts/', newGiftFileName));
                await giftFile.mv(path.join(__dirname, '..', '..', '..', '..', 'client', 'public/gifts/', newGiftFileName));
                await Gifts.create({ name, detail, cost, src: newGiftFileName });
                res
                .status(204)
                .json({})
            } catch (err) {
              console.log(err);
              next(err)
            }
          } else {
            res
            .status(400)
            .json({error: 'no image file'})
          }
    } catch (err) {
        console.log(err)
        next(err)
    }
}

module.exports = addGift;