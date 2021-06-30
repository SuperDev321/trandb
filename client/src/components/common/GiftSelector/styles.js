import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        maxHeight: 250,
        overflow: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: `#585B5E #ecdbdb00`,
        WebkitOverflowScrolling: 'touch', 
        '&::-webkit-scrollbar': {
            width: '3px',
        },
        '&::-webkit-scrollbar-track': {
            '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&:hover::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgb(0 0 0 / 25%)',
            outline: 'none',
            borderRadius: '5px',
        }
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