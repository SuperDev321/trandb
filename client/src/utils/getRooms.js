import axios from 'axios';
import config from '../config'
const getRooms = async (successCallback, errCallback) => {
    try {
        const {
            data: { data },
        } = await axios({url: `${config.server_url}/api/rooms`, method: 'GET'});
        // setLoading(false);
        // setRooms(data);
        successCallback(data);
    } catch (err) {
        // console.log('get room error')
        errCallback('Something went wrong, please try again later')
        // setLoading(false);
        // setError('Something went wrong, please try again later');
    }
};

export default getRooms;
