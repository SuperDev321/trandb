import axios from 'axios';
import config from '../config'
const getRoomDetail = async (roomName, successCallback, errCallback) => {
    try {
        const token = window.localStorage.getItem('token');
        const {
            data: { data, statusCode, error },

        } = await axios.get(`${config.server_url}/api/rooms/` + roomName, {
            headers: {
                authorization: token
            }
        });
        // setLoading(false);
        // setRooms(data);
        
        if(statusCode === 200) {console.log('status',statusCode)
            successCallback(data);
        } else {
            errCallback(error)
        }
        
    } catch (err) {
        errCallback('Something went wrong, please try again later')
        // setLoading(false);
        // setError('Something went wrong, please try again later');
    }
};

export default getRoomDetail;