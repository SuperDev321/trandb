import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    inputEmojiContainer: {
        // color: '#4b4b4b',
        color: theme.palette.menu.color,
        textRendering: 'optimizeLegibility',
        // backgroundColor: theme.,
        // border: '1px solid',
        // borderColor: theme.palette.placeHolder,
        boxShadow: '0 0 0px 1px #0000002b',
        borderRadius: '21px',
        margin: '5px 10px',
        boxSizing: 'border-box',
        flex: '1 1 auto',
        fontSize: '15px',
        fontFamily: 'sans-serif',
        fontWeight: 400,
        lineHeight: '20px',
        minHeight: '20px',
        minWidth: 0,
        outline: 'none',
        width: 'inherit',
        willChange: 'width',
        verticalAlign: 'baseline',
        border: 'none',
        marginRight: 0,
        marginLeft: 0,
        background: 'rgba(255, 255, 255, 0.15)'
      },
      
      inputEmojiWrapper: {
        display: 'flex',
        overflow: 'hidden',
        flex: '1',
        position: 'relative',
        paddingRight: 0,
        verticalAlign: 'baseline',
        outline: 'none',
        margin: 0,
        padding: 0,
        border: 0,
      },
      
      inputEmojiInput: {
        maxHeight: '100px',
        minHeight: '40px',
        outline: 'none',
        overflowX: 'hidden',
        overflowY: 'auto',
        position: 'relative',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        zIndex: '1',
        width: '100%',
        userSelect: 'text',
        padding: '9px 12px 11px',
        wordBreak: 'break-word',
        '& img': {
            verticalAlign: 'middle',
            width: '18px !important',
            height: '18px !important',
            display: 'inline !important',
            marginLeft: '1px',
            marginRight: '1px',
        },
      },
      
      inputEmojiOverlay: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 9,
      },
      
      inputEmojiPlaceholder: {
        color: theme.palette.placeHolder,
        pointerEvents: 'none',
        position: 'absolute',
        transition: 'opacity 0.08s linear',
        userSelect: 'none',
        opacity: '1',
        zIndex: '2',
        left: '12px',
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        width: 'calc(100% - 25px)',
      },
      
      inputEmojiButton: {
        position: 'relative',
        display: 'block',
        textAlign: 'center',
        padding: '0 10px',
        overflow: 'hidden',
        transition: 'color 0.1s ease-out',
        margin: 0,
        boxShadow: 'none',
        background: 'none',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        flexShrink: 0,
        '& svg': {
            fill: theme.palette.emoji,
        }
      },
      
      inputEmojiButtonShow:{
         '& svg': {
            fill: '#128b7e',
        }, 
      },
      
      emoji: {
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
      },
      
      emojiPickerContainer: {
        position: 'absolute',
        top: 0,
        width: '100%',
      },
      
      emojiPickerWrapper: {
        height: '320px',
      },
      emojiPickerWrapperShow: {
        height: '320px !important',
      },
      
      emojiPickerWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 0,
        width: '285px',
        overflow: 'hidden',
        zIndex: '10',
      },
      
      emojiPicker: {
        position: 'absolute',
        top: '320px',
        direction: 'rtl',
        right: 0,
        transition: 'top 0.1s ease-in-out',
        '& *': {
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
                width: '5px',
            },
            '&::-webkit-scrollbar-track': {
                '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
            },
            '&:hover::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgb(0 0 0 / 25%)',
                outline: 'none',
                borderRadius: '5px',
            }
        }
      },
      
      emojiPickerShow: {
        top: 0,
      },
}));

export default useStyles;