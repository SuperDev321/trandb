import React from 'react';
import propTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AndroidIcon from '@material-ui/icons/Android';
import { green } from '@material-ui/core/colors';
const useStyles = makeStyles((theme) => ({
    root: {
        padding: 5,
        margin: 3,
        marginLeft: 35,
        borderRadius: 5,
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        width: 'fit-content',
        padding: '0.1rem 1rem',
        background: '#c31dceb8',
        alignItems: 'center'
    },
    icon: {
        color: green[200]
    }
}))

const BootMessage = ({ text }) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <AndroidIcon fontSize='large' className={classes.icon} />
            <span>:&nbsp;</span>
            <span className={classes.text}>
                {text.trim()}
            </span>
        </div>
    );
};

BootMessage.propTypes = {
  text: propTypes.string.isRequired,
};

export default React.memo(BootMessage);
