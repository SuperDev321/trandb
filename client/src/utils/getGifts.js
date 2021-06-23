import axios from 'axios';
import config from '../config'
const getGifts = async (successCallback, errCallback) => {
    try {
        const {
            data
        } = await axios.get(`${config.server_url}/api/gifts`);
        successCallback(data);
    } catch (err) {
        errCallback('Something went wrong, please try again later')
    }
};

export default getGifts;