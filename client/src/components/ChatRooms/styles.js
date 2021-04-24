import { makeStyles } from '@material-ui/core/styles';
import { BorderColor } from '@material-ui/icons';

const drawerWidth = 260;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexGrow: '1',
        width: '100%',
    },
    mainWrapper: {
        flexGrow: 1,
        overflow: 'hidden',
        // margin: '1px',
        // marginBottom: 0,
        // marginRight: 0,
        position: 'relative',
    },
    main: {
        flexGrow: 1,
        height: `calc(100vh - 102px)`,
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
        },
        height: `calc(100vh - 50px)`,
        background: 'transparent',
        borderRadius: '0px',
        // margin: '1px 0 0 0',
        border: 'solid 1px',
        borderColor: theme.palette.separate.main
    },
    drawerWrapper: {
        zIndex: '100',
    },
    modbileDrawer: {
        [theme.breakpoints.up('xs')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
        height: `calc(100vh - 50px)`,
        position: 'absolute',
        bottom: '0px',
        right: '0px',
        borderRadius: '0',
        background: 'white',
        zIndex: '100',
        border: 'solid 1px',
        borderColor: theme.palette.separate.main
    },
    chatBar: {
        [theme.breakpoints.up('sm')]: {
        //   width: `calc(100% - ${drawerWidth}px)`,
        //   marginLeft: drawerWidth,
        },
        boxShadow: '1px 1px 0px 0px rgb(0 0 0 / 0%), 0px 1px 0px 0px rgb(0 0 0 / 5%)',
        background: theme.palette.menu.background,
        // height: '50px',
        color: theme.palette.textColor.main,
        border: 'solid 1px',
        borderColor: theme.palette.separate.main,
        borderLeft: 'none',
        borderRight: 'none',
    },
    chatBarContent: {
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        height: '100%'
    },
    menuButton: {
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        display: 'flex',
        flexDirection:'row-reverse',
        height: '100%',
    }
    ,
    // chatContent: {
    //     display: 'flex',
    //     flexDirection: 'column',
    //     justifyContent: 'space-between',
    //     height: '100%',
    //     position: 'relative'
    // },
    closeButton: {
        borderRadius: '0px',

    }
}));

export default useStyles;