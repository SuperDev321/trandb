import axios from 'axios';
import config from '../config'
const handleLogin = async (credentials, successCallback, errCallback) => {
  try {
    await axios.post(`${config.server_url}/api/login`, credentials);
    successCallback();
  } catch (err) {
    let errMessage;

    if (err.response.status) {
      errMessage = err.response.data.message;
    } else {
      errMessage = 'Something went wrong, please try again later';
    }
    console.log(errMessage)

    errCallback(errMessage);
  }
};

export default handleLogin;
