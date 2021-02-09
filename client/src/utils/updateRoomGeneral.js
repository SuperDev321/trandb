import axios from 'axios';
import config from '../config'
const handleCreateRoom = async (data, successCallback, errCallback) => {
  try {

    console.log('axios data', data)
    await axios.put(`${config.server_url}/api/room/general`, data);
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
