import axios from 'axios';

const getPrivateMessages = async ({from, to}, successCallback, errCallback) => {
    try {
        const {
            data: { data },
        } = await axios.post('/api/messages/private', {from, to});
        // setLoading(false);
        // setRooms(data);
        successCallback(data);
    } catch (err) {
        errCallback('Something went wrong, please try again later')
        // setLoading(false);
        // setError('Something went wrong, please try again later');
    }
};

export default getPrivateMessages;
