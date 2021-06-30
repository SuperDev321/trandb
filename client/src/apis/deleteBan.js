import axios from 'axios';
import config from '../config'
const deleteBan = async (banId ,successCallback, errCallback) => {
    try {
        let token = window.localStorage.getItem('token');
        const {status} = await axios.delete(`${config.server_url}/api/bans/`+banId, {
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

export default deleteBan;