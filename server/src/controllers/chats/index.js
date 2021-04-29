const getPrivateChat = require('./getPrivateChat');
const fileUploader = require('./fileUploader')
const getAllChats = require('./getAllChats')
const getPublicChat = require('./getPublicChat')
const deleteChat = require('./deleteChat')
module.exports = {
    getPrivateChat,
    fileUploader,
    getAllChats,
    getPublicChat,
    deleteChat
}