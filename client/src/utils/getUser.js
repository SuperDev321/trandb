import axios from 'axios';

const getUser = async (username ,successCallback, errCallback) => {
    try {
        const {
            data: { data },
        } = await axios.get('/api/user'+username);
        successCallback(data);
    } catch (err) {
        errCallback('Something went wrong, please try again later')
    }
};

export default getUser;