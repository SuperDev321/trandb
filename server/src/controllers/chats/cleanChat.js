const {Chats, Rooms} = require('../../database/models');

const cleanPublicChat = async (req, res) => {
    try {
      console.log('public delete')
        await Chats.deleteMany({ 'type': 'public' });
        res
          .status(204)
          .json({})
    } catch (err) {
      console.log(err)
        res
        .status(400)
        .json({
            error: 'Bad request'
        })
    }
}

const cleanPrivateChat = async (req, res) => {
  try {
    console.log('private delete')
      await Rooms.deleteMany({ type: { $eq: 'private'} });
      // await Chats.deleteMany({ type: { $eq: 'private'} });
      res
        .status(204)
        .json({})
  } catch (err) {
    console.log(err.message)
      res
      .status(400)
      .json({
          error: 'Bad request'
      })
  }
}

module.exports = { cleanPublicChat, cleanPrivateChat };
