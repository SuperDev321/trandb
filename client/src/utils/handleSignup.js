import axios from 'axios';
import config from '../config'
const handleSignup = async (data, successCallback, errCallback) => {
  try {
    await axios.post(`${config.server_url}/api/signup`, data);
    await axios.post(`${config.server_url}/api/login`, data);
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

export default handleSignup;
