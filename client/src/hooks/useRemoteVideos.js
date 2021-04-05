import React, { useEffect, useReducer } from 'react';
import { mediaSocket } from '../utils';

const remoteVideoReducer = (state, action) => {
    switch(action.type) {

    }
}

const useRemoteVideos = () => {
    const [state, dispatch] = useReducer(remoteVideoReducer, null);

    const {
        status,
        data,
        error
    } = state;

    useEffect(() => {
        mediaSocket.on('newProducers', async function(data) {
            console.log('new producers', data);
        })

    }, [mediaSocket, remoteVideoReducer])
}