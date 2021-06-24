import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import { green } from '@material-ui/core/colors';
const useStyles = makeStyles((theme) => ({
    root: {
        margin: 3,
        marginLeft: 35,
        borderRadius: 5,
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        width: 'fit-content',
        padding: '0.1rem 1rem',
        background: '#367a84b8',
        alignItems: 'center'
    },
    icon: {
        color: green[200]
    },
}))

const GiftMessage = ({ text }) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <CardGiftcardIcon fontSize='large' className={classes.icon} />
            <span>:&nbsp;</span>
            <span className={classes.text}>
                {text.trim()}
            </span>
        </div>
    );
};

export default React.memo(GiftMessage);
