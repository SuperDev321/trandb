import axios from 'axios';

const handleGoogleLogin = async (response, successCallback, errCallback) => {
  try {
    const { tokenId } = response;
    await axios.post('/api/login/google', { tokenId });
    successCallback();
  } catch (err) {
    errCallback();
  }
};

export default handleGoogleLogin;
