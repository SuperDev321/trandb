import axios from 'axios';
import config from '../config'
const getUserDetail = async (username, successCallback, errCallback) => {
    
    try {
        let token = window.localStorage.getItem('token');
        let result = await axios.get(`${config.server_url}/api/user/`+username, {
            headers: {
                authorization: token
            }
        });
        const userInfo = result.data;
        const {data: {data}} = await axios.get(`${config.server_url}/api/users/`+userInfo._id + '/rooms', {
            headers: {
                authorization: token
            }
        })
        userInfo.rooms = data
        successCallback(userInfo);
    } catch (err) {
        errCallback('Something went wrong, please try again later')
        // setLoading(false);
        // setError('Something went wrong, please try again later');
    }
};

export default getUserDetail;