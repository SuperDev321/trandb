import axios from 'axios';
import config from '../config'
const getPrivateMessages = async ({from, to}, successCallback, errCallback) => {
    try {
        let token = window.localStorage.getItem('token');
        const {
            data: { data },
        } = await axios.post(`${config.server_url}/api/messages/private`, {from, to}, {
            headers: {
                authorization: token
            }
        });
        // setLoading(false);
        // setRooms(data);
        successCallback(data);
    } catch (err) {
        errCallback('Something went wrong, please try again later')
        // setLoading(false);
        // setError('Something went wrong, please try again later');
    }
};

export default getPrivateMessages;
