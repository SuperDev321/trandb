import React, { useReducer } from 'react';

const getDevices = async () => {
    return navigator.mediaDevices.enumerateDevices()
    .then((devices) => {
        let audioDevices = [];
        let videoDevices = [];
        if(devices && devices.length) {
            for (let index = 0; index < devices.length; index++) {
                const element = devices[index];
                if (element.deviceId != "default" && element.deviceId != "communications") {
                    if (element.kind == "audioinput") {
                        audioDevices.push({deviceId: element.deviceId, label: element.label, groupId: element.groupId});
                    } else if (element.kind == "videoinput") {
                        videoDevices.push({deviceId: element.deviceId, label: element.label, groupId: element.groupId});
                    }
                }
            }
        }
        return {
            audioDevices,
            videoDevices
        }
    })
    .catch((err) => {
      console.log(err)
      return err;
    })
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

const useDevices = (initialState) => {
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
        run(getDevices())
      }, [getDevices, run])
    
    return {
        error,
        status,
        data,
        run,
    }
}

export default useDevices;