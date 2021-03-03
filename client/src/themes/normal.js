import { createMuiTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'

// Normal or default theme
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#263238',
      text: '#ffffff',
    },
    secondary: {
      main: '#cc4444',
    },
    error: {
      main: red.A400,
    },
    textColor: {
      main: '#212121'
    },
    separate: {
      main: '#d2d2e2'
    },
    background: {
      default: '#f5f5f5',
    },
    inputField: 'rgb(204 213 216 / 15%)',
    placeHolder: 'rgb(121 127 128 / 77%)',
    emoji: '#858585',
    menu: {
      background: 'white',
      color: 'black',
    },
    titleBar: {
      main: '#f5f5f5',
      contrastText: '#000000',
    },
  },
  direction: 'rtl',
})

export default theme