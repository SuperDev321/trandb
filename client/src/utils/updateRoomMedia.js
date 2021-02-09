import axios from 'axios';
import config from '../config'
const updateRoomMedia = async (data, successCallback, errCallback) => {
  try {
    let formData = new FormData();
    console.log('axios data', data);
    formData.append('_id', data._id);
    formData.append('cover', data.cover);
    formData.append('icon', data.icon);
    await axios.put(`${config.server_url}/api/room/media`, formData, {
        headers: {'Content-type': 'multipart/form-data'}
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

export default updateRoomMedia;
