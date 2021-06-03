import React from 'react';
import propTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: 5,
        marginLeft: 35,
        marginBottom: 5,
        marginTop: 5,
        borderRadius: 5,
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        width: 'fit-content',
        background: '#28a3c9b8',
        fontSize: '0.8rem'
    },
}))

const JoinLeaveMessage = ({ text }) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <span className={classes.text}>
                {text.trim()}
            </span>
        </div>
    );
};

JoinLeaveMessage.propTypes = {
  text: propTypes.string.isRequired,
};

export default React.memo(JoinLeaveMessage);
