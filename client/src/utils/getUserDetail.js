import axios from 'axios';
import config from '../config'
const getUserDetail = async (username, successCallback, errCallback) => {
    
    try {console.log('get room detail', username)
        let result = await axios.get(`${config.server_url}/api/user/`+username);
        console.log(result)
        const userInfo = result.data;
        

        const {data: {data}} = await axios({url: `${config.server_url}/api/users/`+userInfo._id + '/rooms'})
        console.log(userInfo, data);
        userInfo.rooms = data
        // setLoading(false);
        // setRooms(data);
        successCallback(userInfo);
    } catch (err) {
        console.log('get room error')
        errCallback('Something went wrong, please try again later')
        // setLoading(false);
        // setError('Something went wrong, please try again later');
    }
};

export default getUserDetail;