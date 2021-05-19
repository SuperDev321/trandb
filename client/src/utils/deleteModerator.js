import axios from 'axios';
import config from '../config'
const deleteModerator = async (roomId, moderatorId ,successCallback, errCallback) => {
    try {
        const token = window.localStorage.getItem('token');
        const {status} = await axios.post(`${config.server_url}/api/moderators/delete`, {moderatorId, roomId}, {
            headers: {
                authorization: token
            }
        });
        if(status === 204)
            successCallback(true);
    } catch (err) {
        errCallback('Something went wrong, please try again later')
    }
};

export default deleteModerator;