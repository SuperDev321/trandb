import axios from 'axios';
import config from '../config'
const deleteBan = async (banId ,successCallback, errCallback) => {
    try {
        const {status} = await axios.delete(`${config.server_url}/api/bans/`+banId);
        if(status === 204)
            successCallback(true);
    } catch (err) {
        errCallback('Something went wrong, please try again later')
    }
};

export default deleteBan;