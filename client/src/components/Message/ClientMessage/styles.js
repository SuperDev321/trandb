import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    message: {
        display: 'flex',
        padding: '0.1rem 0.1rem',
        height: 'auto',
        alignItems: 'flex-end',
        marginBottom: 3,
        [theme.breakpoints.down('xs')]: {
            maxWidth: 600,
        },
        color: props => {
            if (props.color && theme.palette.messageColors[props.color]) {
                return theme.palette.messageColors[props.color]
            } else if (theme.palette.messageColors.default) {
                return theme.palette.messageColors.default
            } else {
                return '#fff'
            }
        },
        '&:hover': {
            backgroundColor: '#00000017',
        }
    },
    messageContent: {
        // min-width: 100px;
        height: 'auto',
        margin: 0,
        flex: 1,
        '& p': {
          margin: 0
        },
        display: 'flex',
        justifyContent: 'start',
        alignContent: 'baseline',

    },
    sender: {
        display: 'flex',
        // alignItems: 'center',
        margin: 0,
        whiteSpace: 'nowrap',
        fontWeight: 'bold',
        flexDirection: 'row',
        fontSize: '1em',
    },
    time: {
        font: 'italic 0.8em sans-serif',
        minWidth: '35px',
        lineHeight: '1',
        margin: '0',
    },
    text: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        margin: 0,
        fontSize: '1em',
        '& img.photo': {
          maxWidth: '250px !important',
          width:' auto !important',
          height: 'auto !important',
        },
        fontWeight: (props) =>
            props.bold? 'bold' : '',
        '& img.emoji': {
            verticalAlign: 'bottom',
            width: (props) =>
            props.messageSize? props.messageSize + 7 : 28,
            height: (props) =>
            props.messageSize? props.messageSize + 7 : 28,
        },
        '& img.custom-emoji': {
            verticalAlign: 'bottom',
            width: (props) =>
            props.messageSize? props.messageSize + 31 : 28,
            height: (props) =>
            props.messageSize? props.messageSize + 31 : 28,
        },
        '& img': {
            width: 28,
            height: 28
        },
        '& a': {
            cursor: 'pointer',
            color : '#007bff',
            textDecoration: 'none',
            '&:hover': {
                color : '#0056b3',
                textDecoration: 'underline',
            }
        }
    },
    url_underline: {
        cursor: 'pointer',
        color : '#007bff',
        '&:hover': {
            color : '#0056b3',
            textDecoration: 'underline',
        }
    },
    size9: { '& img': { width: 21, height: 21} },
    size10: { '& img': { width: 21, height: 21} },
    size11: { '& img': { width: 22, height: 22} },
    size12: { '& img': { width: 22, height: 22} },
    size13: { '& img': { width: 23, height: 23} },
    size14: { '& img': { width: 23, height: 23} },
    size15: { '& img': { width: 24, height: 24} },
    size16: { '& img': { width: 24, height: 24} },
    size17: { '& img': { width: 25, height: 25} },
    size18: { '& img': { width: 25, height: 25} },
    size19: { '& img': { width: 26, height: 26} },
    size20: { '& img': { width: 26, height: 26} },
    size21: { '& img': { width: 27, height: 27} },
    size22: { '& img': { width: 27, height: 27} },
    size23: { '& img': { width: 28, height: 28} },
    size24: { '& img': { width: 28, height: 28} },
    size25: { '& img': { width: 29, height: 29} },
    size26: { '& img': { width: 29, height: 29} },
    size27: { '& img': { width: 30, height: 30} },
    size28: { '& img': { width: 31, height: 31} },
    size29: { '& img': { width: 32, height: 32} },
    size30: { '& img': { width: 33, height: 33} },
    size31: { '& img': { width: 34, height: 34} },
    size32: { '& img': { width: 35, height: 35} },
    size33: { '& img': { width: 36, height: 36} },
    size34: { '& img': { width: 37, height: 37} },
    size35: { '& img': { width: 38, height: 38} },
    size36: { '& img': { width: 39, height: 39} },
    size37: { '& img': { width: 40, height: 40} },
    size38: { '& img': { width: 42, height: 42} },
    size39: { '& img': { width: 43, height: 43} },
    size40: { '& img': { width: 44, height: 44} },
    photo: {
        maxWidth: '250px !important',
        width: 'auto !important',
        height: 'auto !important'
    }
}));

export default useStyles;