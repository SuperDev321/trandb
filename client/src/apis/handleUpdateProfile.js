import axios from 'axios';
import config from '../config'
const handleUpdateProfile = async (data, successCallback, errCallback) => {
  try {

    let formData = new FormData();
    formData.append('username', data.username);
    formData.append('avatar', data.avatar);
    formData.append('aboutMe', data.aboutMe);
    formData.append('avatarType', data.avatarType);
    let token = window.localStorage.getItem('token');
    await axios.post(`${config.server_url}/api/profile/update`, formData, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: token
      }
    });
    successCallback();
  } catch (err) {
    let errMessage;

    if (err.response.status) {
      errMessage = err.response.data.message;
    } else {
      errMessage = 'Something went wrong, please try again later';
    }

    errCallback(errMessage);
  }
};

export default handleUpdateProfile;
