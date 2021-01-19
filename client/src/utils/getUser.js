import axios from 'axios';

const getUser = async (username ,successCallback, errCallback) => {
    try {
        const {
            data: { data },
        } = await axios({url: '/api/users/'+username, method: 'GET'});
        successCallback(data);
    } catch (err) {
        errCallback('Something went wrong, please try again later')
    }
};

export default getUser;