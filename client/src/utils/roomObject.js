import Peer from 'simple-peer';
import { socket } from '../utils';
class RoomObject  {
    constructor(name, messages, users, blocks) {
        this.name = name;
        if(messages) {
            this.messages = messages;
        } else {
            this.messages = [];
        }
        if(users) {
            // let roomUsers = users.map((user) => ({...user, muted: false}));
            // this.users = roomUsers;
            this.setOnlineUsers(users);
        } else {
            this.users = [];
        }
        this.unReadMessages = [];
        this.private = {};
        this.mutes = [];
        // let mutes = null;
        // let item = window.localStorage.getItem('mutes');
        // if(item) mutes = JSON.parse(item);
        // if(!Array.isArray(mutes)) mutes = null;
        // if(mutes) {
        //     let myMutes = mutes.filter((value) => (value.room === this.name));
        //     this.mutes = myMutes.map(({user})=> (user));
        // } else {
        //     this.mutes = [];
        // }
        this.initMutes();
        if(Array.isArray(blocks)) {
            this.blocks = blocks;
        } else {
            this.blocks = [];
        }
        

        this.myStream = null;
        this.remoteStreams = [];
        this.cameraState = false;
    }

    initMutes() {
        let mutes = null;
        let item = window.localStorage.getItem('mutes');
        if(item) mutes = JSON.parse(item);
        if(!Array.isArray(mutes)) mutes = [];
        if(mutes) {
            let myMutes = mutes.filter((value) => (value.room === this.name));
            mutes = myMutes.map(({user})=> (user));
        } else {
            mutes = [];
        }
        this.mutes = mutes;
        // if(Array.isArray(blocks)) {
        //     mutes = [...mutes, ...blocks];
        //     this.users = this.users.map((user) => {
        //         if(blocks.includes(user.username)) {
        //             user.blocked = true;
        //         } else {
        //             user.blocked = false;
        //         }
        //         return user;
        //     })
        // }
        // mutes = [...mutes, ...blocks];
        // let muteSet = new Set(mutes);
        // this.mutes = Array.from(muteSet);
        
    }

    updateBlocks(blocks) {
        if(Array.isArray(blocks)) {
            this.blocks = blocks;
        }
    }
    
    setMessages(messages) {
        this.messages = [...messages];
    }

    addMessages(messages) {
        // console.log('set message to room object', messages);
        this.messages = [...this.messages, ...messages];
    }

    setMutes(mutes) {
        this.mutes = [...mutes];
    }
    addMute(mute) {
        this.mutes = [...this.mutes, mute];
    }
    toogleMute(mute) {
        if(this.mutes.includes(mute)) {
            this.deleteMute(mute);
        } else {
            this.addMute(mute);
        }
    }
    deleteMute(mute) {
        // let user = this.users.find((item) => (item.username === mute));
        // if(!user.blocked) {
            this.mutes = this.mutes.filter((item) => (item && (item.username !== mute.username) && (item.ip !== mute.ip)));
            return true;
        // } else {
        //     return false;
        // }
    }

    setOnlineUsers(users) {
        this.users = users;
    }
    addOnlineUser(user) {
        // let mutes = null;
        // let item = window.localStorage.getItem('mutes');
        // if(item) mutes = JSON.parse(item);
        // if(!Array.isArray(mutes)) mutes = null;
        // let muted = false
        // if(mutes) {
        //     let mute = mutes.find((value) => (value.room === this.name && value.user === user.username));
        //     if(mute) muted = true;
        // }
        // if(user.blocked && !this.mutes.includes(user.username)) {
        //     this.mutes = [...this.mutes, user.username];
        // }
        let currentUserNames = this.users.map(({username}) => (username));
        if(!currentUserNames.includes(user.username)) {
            this.users = [...this.users, user];
            return true;
        } else {
            return false;
        }
    }

    openCamera = async () => {
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

