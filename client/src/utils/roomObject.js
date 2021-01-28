import Peer from 'simple-peer';
import { getSocket } from '../utils';
class RoomObject  {
    constructor(name, messages, users) {
        this.name = name;
        if(messages) {
            this.messages = messages;
        } else {
            this.messages = [];
        }
        if(users) {
            // let roomUsers = users.map((user) => ({...user, muted: false}));
            // this.users = roomUsers;
            this.setOnlinUsers(name, users);
        } else {
            this.users = null;
        }
        this.unReadMessages = [];
        this.private = {};

        this.myStream = null;
        this.remoteStreams = [];
        this.cameraState = false;
    }
    
    setMessages(messages) {
        this.messages = [...messages];
    }

    addMessages(messages) {
        // console.log('set message to room object', messages);
        this.messages = [...this.messages, ...messages];
    }

    setOnlinUsers(roomName, users) {
        let mutes = null;
        let item = window.localStorage.getItem('mutes');
        if(item) mutes = JSON.parse(item);
        if(!Array.isArray(mutes)) mutes = null;
        let roomUsers = users.map((item) => {
            let muted = false
            if(mutes) {
                let mute = mutes.find((value) => (value.room === this.name && value.user === item.username));
                if(mute) muted = true;
            }
            return {...item, muted}
        });
        
        this.users = roomUsers;
    }
    addOnlineUser(user) {
        let mutes = null;
        let item = window.localStorage.getItem('mutes');
        if(item) mutes = JSON.parse(item);
        if(!Array.isArray(mutes)) mutes = null;
        let muted = false
        if(mutes) {
            let mute = mutes.find((value) => (value.room === this.name && value.user === user.username));
            if(mute) muted = true;
        }
        let currentUserNames = this.users.map(({username}) => (username));
        if(!currentUserNames.includes(user.username)) {
            this.users = [...this.users, {...user, muted}];
        }
    }

    openCamera = async () => {
        let socket = getSocket();
        let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        this.streams.push(stream);
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream,
        });

        this.peer=peer;
    
        peer.on("signal", data => {
            // callback(data);
            socket.emit("broadcast video", { signalData: data, from: this.name })
        })
    
        peer.on("stream", stream => {
            this.streams.push(stream);
        });

        peer.on('error', (err)=>{
        
        })
    }
}

export default RoomObject;

