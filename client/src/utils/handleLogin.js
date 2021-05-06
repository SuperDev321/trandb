import axios from 'axios';
import config from '../config'
const handleLogin = async (credentials, successCallback, errCallback) => {
  try {
    await axios.post(`${config.server_url}/api/login`, credentials);
    successCallback();
  } catch (err) {
    let errMessage;

    if (err && err.response && err.response.status) {
      if(err.response.data.error)
        errMessage = err.response.data.error;
      else {
        errMessage = 'unknown_error';
      }
    } else {
      errMessage = 'unknown_error';
    }
    errCallback(errMessage);
  }
};

export default handleLogin;
