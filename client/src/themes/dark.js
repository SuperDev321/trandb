import { createMuiTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'

// Normal or default theme
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#263238',
      text: '#ffffff',
      tab: '#f0f0f0ab'
    },
    secondary: {
      main: '#cc4444',
    },
    error: {
      main: red.A400,
    },
    textColor: {
      main: '#e5e5e5',
    },
    separate: {
      main: '#f0f0f0ab'
    },
    background: {
      default: '#000',
    },
    inputField: 'rgb(204 213 216 / 15%)',
    placeHolder: 'rgb(179 221 237 / 15%)',
    emoji: '#c2d2c9',
    menu: {
      background: '#000',
      color: '#d5d5d5',
    },
    titleBar: {
      main: '#eeeeee',
      contrastText: '#222222',
    },
  },
  direction: 'rtl',
})

export default theme