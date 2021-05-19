import axios from 'axios';
import config from '../config';
import {createNewSocket} from './socketHandler';
const handleLogin = async (credentials, successCallback, errCallback) => {
  try {
    let result = await axios.post(`${config.server_url}/api/login/guest`, credentials);
    if(result && result.status === 200) {
      let token = result.data.token;
      window.localStorage.setItem('token', token);
      createNewSocket(token);
    }
    successCallback();
  } catch (err) {
    let errMessage;

    if (err && err.response && err.response.status) {
      if(err.response.data.error === 'forbidden' || err.response.data.error === 'already_exist' )
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
