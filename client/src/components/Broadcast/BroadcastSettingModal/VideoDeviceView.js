import React, { useEffect, useReducer } from 'react';

const getStream = async () => {
    return navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
    });
}

function asyncReducer(state, action) {
    switch (action.type) {
      case 'pending': {
        return {status: 'pending', data: null, error: null}
      }
      case 'resolved': {
        return {status: 'resolved', data: action.data, error: null}
      }
      case 'rejected': {
        return {status: 'rejected', data: null, error: action.error}
      }
      default: {
        throw new Error(`Unhandled action type: ${action.type}`)
      }
    }
  }

const useStream = (initialState) => {
    const [state, dispatch] = React.useReducer(asyncReducer, {
        data: null,
        status: 'idle',
        error: null,
        ...initialState
    });

    const {data, status, error} = state;
    const run = React.useCallback(promise => {
        if (!promise) {
          return
        }
        dispatch({type: 'pending'})
        promise.then(
          data => {
            dispatch({type: 'resolved', data})
          },
          error => {
            dispatch({type: 'rejected', error})
          },
        )
        // too bad the eslint plugin can't statically analyze this :-(
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      React.useEffect(() => {
        run(getStream())
      }, [getStream, run])
    
    return {
        error,
        status,
        data,
    }
}

const VideoDeviceView = ({audioState, videoState}) => {
    

    const userVideo = React.useRef(null);
    const userAudio = React.useRef(null);
    const {stream: data, status, error} = useStream();
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        }).then((stream) => {
            if(userVideo.current) {
                userVideo.current.srcObject = stream;
            }
        })
        
    }, [])

    if(status === 'pending' || status === 'idle') {
        return null;
    } else if(status === 'rejected') {
        return error;
    } else if(status === 'resolved')
        return (
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <video ref={userVideo} style={{width: '200px', padding: '5px',}} autoPlay/>
            </div>
        )
    else {
        throw new Error('Unknown state')
    }

}

export default VideoDeviceView;