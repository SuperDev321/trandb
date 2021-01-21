import axios from 'axios';

const handleLogin = async (credentials, successCallback, errCallback) => {
  try {
    await axios.post('https://new.trandb.com:4000/api/login/guest', credentials);
    successCallback();
  } catch (err) {
    console.log(err)
    let errMessage;

    if (err.response.status) {
      errMessage = err.response.data.message;
    } else {
      errMessage = 'Something went wrong, please try again later';
    }

    errCallback(errMessage);
  }
};

export default handleLogin;
