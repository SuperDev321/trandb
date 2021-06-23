import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        display: 'flex',
        
    },
    giftSnap: {
        borderRadius: 10,
        cursor: 'pointer',
        boxShadow: '0 0 8px 1px #44525e2e',
        margin: 3,
        '& video': {
            width: 70,
            height: 70,
        }
    }
}));

export default useStyles;