import axios from 'axios';

const handleCreateRoom = async (data, successCallback, errCallback) => {
  try {

    console.log('axios data', data)
    await axios.put('https://new.trandb.com:4000/api/room/general', data);
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
