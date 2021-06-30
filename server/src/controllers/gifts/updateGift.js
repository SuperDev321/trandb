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
const updateGift = async (req, res, next) => {
    try {
        const { _id, name, detail, cost } = req.body;
        if (req.files && req.files.gift_file && req.files.gift_image_file) {
          const giftFile = req.files.gift_file;
          const newGiftFileName = getFileName("gift_", giftFile.name);
          const giftImageFile = req.files.gift_image_file;
          const newGiftImageFileName = getFileName("gift_", giftImageFile.name);
            try {
                await giftFile.mv(path.join(__dirname, '..', '..', '..', '..', 'client', 'build/gifts/', newGiftFileName));
                await giftFile.mv(path.join(__dirname, '..', '..', '..', '..', 'client', 'public/gifts/', newGiftFileName));
                await giftImageFile.mv(path.join(__dirname, '..', '..', '..', '..', 'client', 'public/gifts/', newGiftImageFileName));
                await Gifts.updateOne({ _id }, { name, detail, cost, src: newGiftFileName, imageSrc: newGiftImageFileName });
                res
                .status(204)
                .json({})
            } catch (err) {
              console.log(err);
              next(err)
            }
          } else {
            await Gifts.updateOne({ _id }, { name, detail, cost });
            res
            .status(204)
            .json({})
          }
    } catch (err) {
        console.log(err)
        next(err)
    }
}

module.exports = updateGift;