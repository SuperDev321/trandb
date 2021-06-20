import React from 'react';
import { makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '20px',
        height: '20px',
        margin: '4px 3px',
        borderRadius: '50%',
        float: 'left',
        fontSize: '1rem',
        '&.active::after': {
            // top: '-3px',
            content: '"\\2713"',
            left: '4px',
            position: 'relative',
            color: theme.palette.background.default
        },
        backgroundColor: props => {
            if (props.color && theme.palette.messageColors[props.color]) {
                return theme.palette.messageColors[props.color]
            } else if (theme.palette.messageColors.default) {
                return theme.palette.messageColors.default
            } else {
                return '#fff'
            }
        }
    }
}))

const ColorSanp = ({color, active, onClick}) => {
    const classes = useStyles({color, active})

    return (
        <div className={`${classes.root} ${active ? 'active' : ''}`}
            onClick={onClick}>
        </div>
    )
}

export default ColorSanp;