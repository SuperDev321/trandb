import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  avatar: {
  	padding: theme.spacing(2),
    textAlign: 'center !important',
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
  	PaddingLeft: '2%',
    '& > *': {
      margin: theme.spacing(0),
      width: '100%',
    },
  },

  formControl: {
    minWidth: 120,
  },

  media: {
    padding: theme.spacing(3),
    marginTop: '25px',
    PaddingLeft: '2%',
    '& > *': {
      margin: theme.spacing(0),
      width: '100%',
    },
  },

  mediaImage: {
    borderRadius: '50%',
    marginTop: '40px',
  },

  fileupload: {
    marginTop: '20px',
    fontSize: '13px',
    color: 'gray',
  },

  button: {
    width:'auto', 
    marginTop: '20px', 
    textTransform: 'none',
  },

}));

export default useStyles;