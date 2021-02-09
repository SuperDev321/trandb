import axios from 'axios';
import config from '../config'
const deleteModerator = async (roomId, moderatorId ,successCallback, errCallback) => {
    try {
        const {status} = await axios.post(`${config.server_url}/api/moderators/delete`, {moderatorId, roomId});
        if(status === 204)
            successCallback(true);
    } catch (err) {
        errCallback('Something went wrong, please try again later')
    }
};

export default deleteModerator;