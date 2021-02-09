import axios from 'axios';

const deleteModerator = async (roomId, moderatorId ,successCallback, errCallback) => {
    try {
        const {status} = await axios.post('https://new.trandb.com:4000/api/moderators/delete', {moderatorId, roomId});
        if(status === 204)
            successCallback(true);
    } catch (err) {
        errCallback('Something went wrong, please try again later')
    }
};

export default deleteModerator;