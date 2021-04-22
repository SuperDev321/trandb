import React from 'react';
import {makeStyles} from '@material-ui/core/styles' 
import { PinDropSharp } from '@material-ui/icons';

const maxSize = 100;
const useStyles = makeStyles((theme) => ({
    root: {
        position: 'absolute',
        width: 7,
        height: '100%',
        flexGrow: 1,
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column-reverse'
    },
    content: {
        width: '100%',
        height:
            props=>
            props.percent?
                `${props.percent}%`:
                '100%',
        background: 
            props=>
                props.percent?
                    `linear-gradient(0deg, rgb(255, 255, 0), rgb(255, ${255-props.percent*2.5}, 0))`:
                    'transparent',
        borderRadius: '2px 2px 0 0'
    }
}))
const SoundMeter = ({size}) => {
    const percent = size/maxSize*100;
    const classes = useStyles({percent});
    return (
        <div className={classes.root}>
        <div className={classes.content}></div>
        </div>
    )
}

export default SoundMeter;