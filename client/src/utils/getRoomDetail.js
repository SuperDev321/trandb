import axios from 'axios';

const getRoomDetail = async (roomName, successCallback, errCallback) => {
    console.log('get room detail')
    try {
        const {
            data: { data },
        } = await axios({url: 'https://new.trandb.com:4000/api/rooms/' + roomName,
            method: 'GET'
        });
        // setLoading(false);
        // setRooms(data);
        successCallback(data);
    } catch (err) {
        // console.log('get room error')
        errCallback('Something went wrong, please try again later')
        // setLoading(false);
        // setError('Something went wrong, please try again later');
    }
};

export default getRoomDetail;