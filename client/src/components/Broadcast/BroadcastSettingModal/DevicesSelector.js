import React, { useEffect } from 'react';
import useDevices from './useDevices';
import {
    FormControl,
    FormGroup,
    FormLabel,
    InputLabel,
    Select,
    MenuItem
} from '@material-ui/core';
const DevicesSelector = ({audio, video, setAudio, setVideo}) => {
    const {data: devices, error: deviceError, status: deviceStatus} = useDevices();
    
    useEffect(() => {
        if(audio === 'default' && devices) {
            let {audioDevices} = devices;
            if(audioDevices && audioDevices.length) {
                setAudio(audioDevices[0].deviceId);
            }
        }
    }, [audio, video, devices, setAudio])

    if (deviceStatus === 'idle') {
        return null;
    } else if (deviceStatus === 'pending') {
        return null;
    } else if (deviceStatus === 'rejected') {
        return null;
    } else if (deviceStatus === 'resolved') {
        const { audioDevices, videoDevices } = devices;
        return (
            <>
            <FormControl>
                <FormLabel component="legend">Select devices to broadcast</FormLabel>
                <FormGroup>
                    <FormControl>
                        <InputLabel id="audio-select-helper-label">Audio</InputLabel>
                        <Select
                            labelId="audio-select-helper-label"
                            id="audio-select-helper"
                            value={audio}
                            onChange={(e) => {console.log('change event');setAudio(e.target.value)}}
                        >
                            <MenuItem value={null}>None</MenuItem>
                            { audioDevices?.map((item, index) => (
                                <MenuItem value={item.deviceId} key={index}>{item.label}</MenuItem>
                            ))
                            }
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="video-select-helper-label">Video</InputLabel>
                        <Select
                            labelId="video-select-helper-label"
                            id="video-select-helper"
                            value={video}
                            onChange={(e) => setVideo(e.target.value)}
                        >
                            <MenuItem value={null}>None</MenuItem>
                            { videoDevices?.map((item, index) => (
                                <MenuItem value={item.deviceId} key={index}>{item.label}</MenuItem>
                            ))
                            }
                        </Select>
                    </FormControl>
                </FormGroup>
            </FormControl>
            </>
        )
    } else {
        throw new Error('This should be impossible');
    }

}

export default DevicesSelector;