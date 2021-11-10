const getPrivateChat = require('./getPrivateChat');
const fileUploader = require('./fileUploader');
const getAllChats = require('./getAllChats');
const getPublicChat = require('./getPublicChat');
const deleteChat = require('./deleteChat');
const { cleanPublicChat, cleanPrivateChat } = require('./cleanChat');
module.exports = {
    getPrivateChat,
    fileUploader,
    getAllChats,
    getPublicChat,
    deleteChat,
    cleanPublicChat,
    cleanPrivateChat
}
