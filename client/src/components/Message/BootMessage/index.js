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
    },
    text: {
        color: props=>(
            props.color?
            props.color
            : 'white'
        ),
        fontSize: props=>(
            props.size?
            props.size
            : '1em'
        ),
        fontWeight: props=>(
            props.bold?
            'bold'
            : 'none'
        ),
    }
}))

const BootMessage = ({ message }) => {
    const {msg, size, color, bold} = message;
    const classes = useStyles({size, color, bold});
    return (
        <div className={classes.root}>
            <AndroidIcon fontSize='large' className={classes.icon} />
            <span>:&nbsp;</span>
            <span className={classes.text}>
                {msg.trim()}
            </span>
        </div>
    );
};

export default React.memo(BootMessage);
