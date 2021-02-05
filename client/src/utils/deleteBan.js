import axios from 'axios';

const deleteBan = async (banId ,successCallback, errCallback) => {
    try {
        const {status} = await axios.delete('/api/bans/'+banId);
        if(status === 204)
            successCallback(true);
    } catch (err) {
        errCallback('Something went wrong, please try again later')
    }
};

export default deleteBan;