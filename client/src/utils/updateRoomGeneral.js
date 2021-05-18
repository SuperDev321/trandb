import axios from 'axios';
import config from '../config'
const handleCreateRoom = async (data, successCallback, errCallback) => {
  try {

    let token = window.localStorage.getItem('token');
    await axios.put(`${config.server_url}/api/room/general`, data, {
      headers: {
        authorization: token
      }
    });
    successCallback();
  } catch (err) {
    let errMessage;

    if (err.response.status) {
      errMessage = err.response.data.error.msg;
    } else {
      errMessage = 'Something went wrong, please try again later';
    }

    errCallback(errMessage);
  }
};

export default handleCreateRoom;
