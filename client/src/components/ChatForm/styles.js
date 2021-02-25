import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    inputArea: {
        borderRadius: '0px',
        display: 'flex',
        height: 'fit-content',
        boxShadow: '1px 1px 0px 0px rgb(0 0 0 / 0%), 0px -1px 0px 0px rgb(0 0 0 / 5%)',
        zIndex: '10',
        backgroundColor: theme.palette.menu.background
    },
    inputForm: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    addButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 25,
        paddingLeft: 5,
    },
    sendButton: {
        color: theme.palette.primary.main,
    },
    boldSelector: {
        font: 'italic',
        cursor: 'pointer',
        fontStyle: 'italic',
        minWidth: 25,
        fontSize: '1.2rem',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";',
        '& span': {
            marginBottom: 2.5
        },
        color: theme.palette.menu.color
    },
    bold: {
        fontWeight: 'bold',
        
    },
    fileUpload: {
        paddingLeft: 3,
        display: 'flex'
    },
    fileUploadInput: {
        width: 0,
        height: 0
    },
    fileUploadLabel: {
        cursor: 'pointer',
        display: 'flex',
        color: theme.palette.menu.color
    }
}));

export default useStyles;