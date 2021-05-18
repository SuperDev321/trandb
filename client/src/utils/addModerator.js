import axios from 'axios';
import config from '../config'

const addModerator = async (roomId, moderatorName, successCallback, errCallback) => {
    let token = window.localStorage.getItem('token');
    axios.post(`${config.server_url}/api/moderators`, {roomId,username: moderatorName}, {
        headers: {
            authorization: token
        }
    })
    .then((response) => {
        console.log(response)
        if(response.status === 200) {
            console.log(response.data)
            successCallback(response.data);
        } else {
            errCallback('You can not add this user as moderator.');
        }
    })
    .catch((err) => {
        if(err && err.response) {
            if(err.response.status === 422) {
                errCallback('Already exists')
            } else if (err.response.status === 403){
                errCallback('Permission denied')
            } else {
                errCallback('You can not add this user as moderator.');
            }
        } else
            errCallback('You can not add this user as moderator.');
    })
}

export default addModerator;