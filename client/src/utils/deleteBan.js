import axios from 'axios';

const deleteBan = async (banId ,successCallback, errCallback) => {
    try {
        const {status} = await axios.delete('https://new.trandb.com:4000/api/bans/'+banId);
        if(status === 204)
            successCallback(true);
    } catch (err) {
        errCallback('Something went wrong, please try again later')
    }
};

export default deleteBan;