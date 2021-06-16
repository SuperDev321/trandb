import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  avatar: {
  	padding: theme.spacing(2),
    textAlign: 'center !important',
  },

  about: {
    padding: theme.spacing(2),
    marginTop: '25px',
  },

  aboutTitle: {
    marginTop: '20px',
    fontWeight: '700',
    fontSize: '18px',
  },

  title: {
    fontWeight: '700',
    fontSize: '18px',
    margin: 0
  },

  aboutBody: {
    marginTop: '15px',
    display: 'flex',
  },

  rightSide: {
    padding: theme.spacing(2),
    '& > *': {
      marginTop: '20px',
      marginBottom: '20px',
    },
  },

  titleName: {
    fontSize: '30px',
    fontWeight: '600',
  },


  roundedCircle: {
    borderRadius: '50%',
    marginTop: '10px',
  },

  avatarName: {
    marginTop: '10px',
  },

  headLine: {
    height:"1px", 
    borderWidth:"1", 
    backgroundColor:"#bdbdbd",
  },

  general: {
  	padding: theme.spacing(3),
  	paddingLeft: '2%',
    '& > *': {
      margin: theme.spacing(0),
      width: '100%',
    },
    '& > button': {
      width: 'inherit',
      float: 'right',
      marginTop: -30
    }
  },

  room: {
    padding: theme.spacing(3),
    marginTop: '25px',
    PaddingLeft: '2%',
    '& > *': {
      margin: theme.spacing(0),
      width: '100%',
    },
  },

  roomBody: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 10
  },


}));

export default useStyles;