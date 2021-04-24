import React, { useReducer } from 'react';

const getUserMedia = async () => {
    navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
    return navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
    })
    .then((stream) => {
        return stream
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

const useDefaultMedia = (initialState) => {
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
            if(data) {
              setTimeout(() => {
                dispatch({type: 'resolved', data})
              }, 300)
            } else {
              dispatch({type: 'rejected', error: 'no device'})
            }
            
          },
          error => {
            dispatch({type: 'rejected', error})
          },
        )
        // too bad the eslint plugin can't statically analyze this :-(
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      React.useEffect(() => {
        run(getUserMedia())
      }, [getUserMedia, run])
    
    return {
        error,
        status,
        data,
    }
}

export default useDefaultMedia;