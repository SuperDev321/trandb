class RoomObject  {
    constructor(name, messages, users, blocks, messageNum = 30) {
        this.name = name;
        if(Array.isArray(messages)) {
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
        this.unReadMessages = null;
        this.private = {};
        this.mutes = [];
        this.messageNum = messageNum
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
        this.cameraState = false;
    }

    initMutes() {
        let mutes = null;
        let item = window.localStorage.getItem('mutes');
        if(item) mutes = JSON.parse(item);
        if(!Array.isArray(mutes)) mutes = [];
        if(mutes) {
            mutes = mutes.filter((value) => (value.room === this.name));
        } else {
            mutes = [];
        }
        this.mutes = mutes;
    }

    checkMuteByName (name) {
        const muteItem = this.mutes?.find((item) => (item.username === name))
        if (muteItem) {
            return true
        } else {
            return false
        }
    }

    updateBlocks(blocks) {
        if(Array.isArray(blocks)) {
            this.blocks = blocks;
        }
    }
    
    setMessages(messages) {
        this.messages = messages.slice(0, this.messageNum);
    }

    addMessages(messages) {
        // console.log('set message to room object', messages);
        let newMessages = [...messages, ...this.messages];
        this.messages = newMessages.slice(0, this.messageNum);
    }

    mergeUnreadMessages() {
        if(this.unReadMessages && this.unReadMessages.length > 0) {
            let newMessages = [...this.unReadMessages, ...this.messages];
            this.messages = newMessages.slice(0, this.messageNum);
        }
        this.unReadMessages = null;
    }

    addUnreadMessage(message) {
        if(Array.isArray(this.unReadMessages)) {
            this.unReadMessages = [message, ...this.unReadMessages];
        } else {
            this.unReadMessages = [message];
        }
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
        this.mutes = this.mutes.filter((item) => (item && (item.username !== mute.username) && (item.ip !== mute.ip)));
        return true;
    }

    setOnlineUsers(users) {
        this.users = users;
    }
    addOnlineUser(user) {
        let currentUserNames = this.users.map(({username}) => (username));
        if(!currentUserNames.includes(user.username)) {
            this.users = [...this.users, user];
            return true;
        } else {
            return false;
        }
    }
    removeOnlineUser(userId) {
        let usersToSet = this.users.filter((user) => (user._id !== userId));
        this.users = usersToSet;
    }
    updateUserInfo (userData) {
        const { username } = userData
        const isInUsers = this.users.find((user) => (user.username === username))
        if (!isInUsers) return false;
        this.users = this.users?.map((user) => {
            if (user.username === username) {
                return { ...user, ...userData };
            } else {
                return user
            }
        })
        return true;
    }
    updateUserPoints (usersWithPoints) {
        let result = false

        const newUsers = this.users?.map((user) => {
            const userToUpdate = usersWithPoints.find(({ _id, point }) => (_id === user._id))
            if (userToUpdate) {
                result = true;
                return { ... user, point: userToUpdate.point}
            } else {
                return user
            }
        });
        if (result) {
            this.users = newUsers;
        }
        return true;
    }
}

export default RoomObject;

