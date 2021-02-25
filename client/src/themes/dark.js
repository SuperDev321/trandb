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
    background: {
      default: '#0e1a19e8',
    },
    placeHolder: '#a7b0b9',
    emoji: '#c2d2c9',
    menu: {
      background: '#132322',
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