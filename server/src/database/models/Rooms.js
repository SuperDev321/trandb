const { Schema, model } = require('mongoose');

const roomSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    user_id: {
        type: Schema.Types.ObjectId
    },
    category: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
    },
    password: String,
    welcomeMessage: String,
    maxUsers: Number,
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Users',
        },
    ],
    moderators: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Users',
        },
    ],
});

const Rooms = model('Rooms', roomSchema);

module.exports = Rooms;
