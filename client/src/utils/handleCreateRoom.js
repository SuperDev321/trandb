import axios from 'axios';
import config from '../config'
const handleCreateRoom = async (data, successCallback, errCallback) => {
  try {

    let formData = new FormData();
    formData.append('name', data.name);
    formData.append('category', data.category);
    formData.append('password', data.password);
    formData.append('maxUsers', data.maxUsers);
    formData.append('description', data.description);
    formData.append('welcomeMessage', data.welcomeMessage);
    formData.append('cover', data.cover);
    formData.append('icon', data.icon);
    let token = window.localStorage.getItem('token');
    await axios.post(`${config.server_url}/api/room`, formData, {
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

export default handleCreateRoom;
