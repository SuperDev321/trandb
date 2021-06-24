import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: 20,
        width: '100%',
        display: 'flex',
    },
    detail: {
        paddingLeft: 20,
        paddingRight: 20,
        display: 'flex',
        flexDirection: 'column'
    },
    action: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        '& button': {
            margin: 5
        }
    }
}));

export default useStyles;