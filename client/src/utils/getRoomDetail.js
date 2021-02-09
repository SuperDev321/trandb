import axios from 'axios';

const getRoomDetail = async (roomName, successCallback, errCallback) => {
    console.log('get room detail')
    try {
        const {
            data: { data, statusCode, error },
        } = await axios({url: '/api/rooms/' + roomName,
            method: 'GET'
        });
        // setLoading(false);
        // setRooms(data);
        
        if(statusCode === 200) {console.log('status',statusCode)
            successCallback(data);
        } else {
            errCallback(error)
        }
        
    } catch (err) {
        errCallback('Something went wrong, please try again later')
        // setLoading(false);
        // setError('Something went wrong, please try again later');
    }
};

export default getRoomDetail;