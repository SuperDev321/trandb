import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        cursor: 'pointer',
        margin: 3,
        display: 'flex',
        flexDirection: 'column',
        width: 'fit-content'
    },
    giftName: {
        textAlign: 'center',
        maxWidth: 70
    },
    giftVideo: {
        width: 70,
        height: 70,
        borderRadius: 10,
        boxShadow: '0 0 8px 1px #44525e2e',
    }
}))
const GiftSnap = ({src, name, ...props}) => {
    const classes = useStyles();

    return (
        <div className={classes.root} {...props}>
            <img className={classes.giftVideo} src={src} alt="gift"/>
            <span className={classes.giftName}>{name}</span>
        </div>
    )
}

export default GiftSnap;