import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'absolute',
        top: '50%',
        right: 'calc(50% - 20px)',
    },
}));

export default useStyles;