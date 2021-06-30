import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import config from '../../../config'
const useStyles = makeStyles((theme) => ({
    root: {
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        top: 50,
        margin: 'auto',
        '& video': {
            width: 200,
            borderRadius: '50%',
        },
        zIndex: 1000
    }
}))


const GiftView = ({gift, setGift}) => {
    const classes = useStyles();
    const videoRef = React.useRef(null);

    const handleEnded = () => {
        setGift(null);
    }

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play();
            videoRef.current.oncanplay = () => {
                videoRef.current.play();
            }
        }
    }, [gift, videoRef])

    if (!gift) {
        return null
    }
    return (
        <div className={classes.root}>
            <video ref={videoRef} src={config.gift_path + gift.src} onEnded={handleEnded} />
        </div>
    )
}

export default GiftView;