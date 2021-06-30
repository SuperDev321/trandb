import axios from 'axios';
import config from '../config'
const getUser = async (roomName ,successCallback, errCallback) => {
    try {
        const {
            data: { data },
        } = await axios.get(`${config.server_url}/api/rooms/`+roomName + '/isPrivate');
        successCallback(data);
    } catch (err) {
        errCallback('Something went wrong, please try again later')
    }
};

export default getUser;