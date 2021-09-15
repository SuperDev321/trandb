import { createTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'

// Normal or default theme
const theme = createTheme({
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
      sub: '#a3adb5'
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
    messageColors: {
      'default': '#e5e5e5',
      'color1': '#656565',
      'color2': '#0400E6',
      'color3': '#6f4341',
      'color4': '#990703',
      'color5': '#ca226b',
      'color6': '#f778a1',
      'color7': '#f32f2f',
      'color8': '#FF6600',
      'color9': '#FF9900',
      'color10': '#f1c85e',
      'color11': '#006666',
      'color12': '#2F4F4F',
      'color13': '#6633CC',
      'color14': '#47b617',
      'color15': '#5cd87e',
      'color16': '#6db4e9',
      'color17': '#CC0066',
      'color18': '#077104',
      'color19': '#0a40f5',
      'color20': '#1a61e3',
      'color21': '#800080',
      'color22': '#993399',
      'color23': '#009900',
      'color24': '#33CC66',
      'color25': '#660000',
      'color26': '#6666FF',
      'color27': '#20264d',
    }
  },
  direction: 'rtl',
})

export default theme