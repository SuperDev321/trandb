import React, { useEffect, useReducer, useCallback } from 'react';

const getStream = (audioDevice, videoDevice) => {
   return navigator.mediaDevices.getUserMedia({
      audio: audioDevice? {
        deviceId: audioDevice
      }: false,
      video: videoDevice? {
        deviceId: videoDevice
      }: false,
    })
};

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

const useStream = ({audioDevice, videoDevice}) => {
    const [state, dispatch] = React.useReducer(asyncReducer, {
        data: null,
        status: 'idle',
        error: null,
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
            console.log(error)
            dispatch({type: 'rejected', error})
          },
        )
        // too bad the eslint plugin can't statically analyze this :-(
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      React.useEffect(() => {
        if(!audioDevice && !videoDevice) return;
        run(getStream(audioDevice, videoDevice))
      }, [run, audioDevice, videoDevice])
    
    return {
        error,
        status,
        data,
    }
}

const VideoDeviceView = ({audioDevice, videoDevice}) => {
    const userVideo = React.useRef(null);
    // const userAudio = React.useRef(null);
    const {data: stream, status, error} = useStream({audioDevice, videoDevice});
    // useEffect(() => {
    //     if(!audioDevice && !videoDevice) return;
    //     navigator.mediaDevices.getUserMedia({
    //         audio: audioDevice? {
    //           deviceId: audioDevice
    //         }: false,
    //         audio: videoDevice? {
    //           deviceId: videoDevice
    //         }: false,
    //     }).then((stream) => {
    //         if(userVideo.current) {
    //             userVideo.current.srcObject = stream;
    //         }
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     })
    //     return () => {
    //       if(userVideo.current.srcObject) {
    //         let stream = userVideo.current.srcObject;
    //         stream.getTracks().forEach(function(track) {
    //           track.stop();
    //           console.log('return video', track)
    //         });
    //         console.log('return video')
    //         userVideo.current = null;
    //       }
    //     }
    // }, [audioDevice, videoDevice])

    useEffect(() => {
      if(stream && status === 'resolved' && userVideo.current) {
        userVideo.current.srcObject = stream;
      }
      return () => {
        if(userVideo.current && userVideo.current.srcObject) {
          console.log('stop tracks')
          userVideo.current.srcObject.getTracks().forEach(function (track) {
            track.stop();
          });
          userVideo.current.srcObject = null;
        }
      }
    }, [stream, status])



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