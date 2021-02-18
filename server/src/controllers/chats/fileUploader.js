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

const fileUploader = async (req, res) => {
    console.log('fileupload')
    if (req.files && req.files.file_icon) {
      var photoIcon = req.files.file_icon;
      var newIconFileName = getFileName("icon_", req.files.file_icon.name);
      try {
        await photoIcon.mv(path.join(__dirname, '..', '..', '..', '..', 'client', 'build/img/messages/',newIconFileName))
        var photoUrl =  "img/messages/" + newIconFileName;
        res
        .status(200)
        .json({
            photoUrl
        })
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log(err);
    }
}

module.exports = fileUploader;
  