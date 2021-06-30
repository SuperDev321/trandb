import axios from 'axios';
import config from '../config'
const getUser = async (username ,successCallback, errCallback) => {
    try {
        const {
            data
        } = await axios.get(`${config.server_url}/api/user/`+username);
        successCallback(data);
    } catch (err) {
        errCallback('Something went wrong, please try again later')
    }
};

const getUserById = async (_id ,successCallback, errCallback) => {
    try {
        const {
            data
        } = await axios.get(`${config.server_url}/api/users/${_id}`);
        console.log(data)
        successCallback(data);
    } catch (err) {
        errCallback('Something went wrong, please try again later')
    }
};

export default getUser;
export { getUserById };