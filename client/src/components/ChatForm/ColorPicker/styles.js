import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    colorArea: {
        width: '30px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
    },
    userColor: {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
    },
    colorPanel: {
        position: 'absolute',
        width: '205px',
        height: '118px',
        bottom: '50px',
        padding: '5px 10px',
        left: '-11px',
        borderRadius: 5,
        backgroundColor: props =>
        props.backgroundColor
        ?props.backgroundColor
        :'#fff',
        boxShadow: '0px -3px 6px 0px #cccccc1a',
        '&::before': {
            content: '" "',
            position: 'absolute',
            display: 'block',
            bottom: '-7px',
            border: '8px solid #fff',
            // borderColor: transparent,
            // borderColor: 'transparent transparent #fff #fff',
            borderColor: props =>
                props.backgroundColor
                ?`transparent ${props.backgroundColor} ${props.backgroundColor} transparent`
                :'transparent',
            '-webkit-transform': 'translateX(-50%) rotate(315deg)',
            transform: 'translateX(-50%) rotate(315deg)',
            boxShadow: '-2px 2px 3px rgba(57, 73, 76, 0.1)',
            left: '25px',
        },
    },
    colorSnap: {
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
            color: props =>
            props.defaultColor
            ?theme.palette.getContrastText(props.defaultColor)
            :'#fff'
        }
    }
    // end
}));

export default useStyles;