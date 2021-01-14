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
        backgroundColor: 'white',
        boxShadow: '0 2px 10px -2px grey',
        '&::before': {
            content: '" "',
            position: 'absolute',
            display: 'block',
            bottom: '-7px',
            border: '8px solid #fff',
            borderColor: 'transparent transparent #fff #fff',
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
        '&.active::after': {
            // top: '-3px',
            content: '"\\2713"',
            left: '4px',
            position: 'relative',
            color: '#fff',
        }
    }
    // end
}));

export default useStyles;