import axios from 'axios';

const handleCreateRoom = async (data, successCallback, errCallback) => {
  try {

    let formData = new FormData();
    formData.append('name', data.name);
    formData.append('category', data.category);
    formData.append('maxUsers', data.maxUsers);
    formData.append('description', data.description);
    formData.append('welcomeMessage', data.welcomeMessage);
    formData.append('cover', data.cover);
    formData.append('icon', data.icon);
    console.log('axios data', data)
    await axios.post('https://new.trandb.com:4000/api/room', formData, {
      headers: {'Content-type': 'multipart/form-data'}
    });
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

export default handleCreateRoom;
