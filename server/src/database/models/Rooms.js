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
    description: String,
    password: String,
    welcomeMessage: String,
    maxUsers: Number,
    cover: String,
    icon: String,
    users: [ 
    {
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
        },
        ip: String
    }
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
