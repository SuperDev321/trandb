import { makeStyles } from '@material-ui/core/styles';
import { deepOrange, pink, blue } from '@material-ui/core/colors';
const useStyles = makeStyles((theme) => ({
    button: {
        borderRadius: '0',
        height: 40,
        textTransform: 'none',
        color: pink[500],
        textTransform: 'none',
    },
    dialog: {
        direction: 'ltr',
        '& .MuiDialog-paper': {
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: theme.spacing(2),
            background: theme.palette.primary.main,
            // minWidth: 500,
        }
        
    },
    content: {
        width: '100%'
    },
    username: {
        color: 'white',
        paddingBottom: theme.spacing(1)
    },
    banType: {
        '& *': {
           color: 'white' 
        },
        paddingBottom: theme.spacing(1)
    },
    ipField: {
    }
}));

export default useStyles;