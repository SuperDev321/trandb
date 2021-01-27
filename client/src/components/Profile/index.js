import React, {useState, useEffect} from "react";
// import { Link } from "react-router-dom";
// import Axios from "axios";
import {
  Paper,
  TextField,
  Button,
  Grid,
  InputLabel,
  FormControl,
  Select,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import useStyles from './styles'

export default function Profile() {
  const classes = useStyles();

  const [category, setCategory] = useState('Social');
  const [description, setDescription] = useState('this is my test room');
  const [message, setMessage] = useState('best practice');
  const [userNum, setUserNum] = useState('- Unlimited -');
  const [password, setPassword] = useState('');
  const [moderator, setModerator] = useState('');

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <Grid container spacing={4} style={{marginTop: '12px'}}>
        <Grid item xs={12} sm={3}>
          <Paper elevation={3} className={classes.avatar}>
            <img className={classes.roundedCircle} width="100px" src="/img/default_avatar.png" alt="Card img cap" />
            <p className={classes.avatarName}>Crystal</p>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={9}>
          <h2>Room - testroom</h2>
          <Paper elevation={3} className={classes.general}>
            <h5>
              General
            </h5>
            <hr className={classes.headLine} style={{marginTop:'10px', }} />
            <FormControl variant="outlined" className={classes.formControl} style={{marginTop: '40px'}}>
              <InputLabel htmlFor="outlined-age-native-simple">Category</InputLabel>
              <Select
                native
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="category"
                inputProps={{
                  name: 'category',
                  id: 'outlined-age-native-simple',
                }}
              >
                <option value="Comedy">Comedy</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Gaming">Gaming</option>
                <option value="Social">Social</option>
                <option value="Technology">Technology</option>
                <option value="Teen">Teen</option>
                <option value="Other">Other</option>
              </Select>
            </FormControl>
            <TextField 
              id="outlined-description" 
              label="Description" 
              variant="outlined" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{marginTop: '40px'}} 
            />
            <TextField
              id="outlined-multiline-static"
              label="Welcome Message"
              multiline
              rows={2}
              defaultValue={message}
              onChange={(e) => setMessage(e.target.value)}
              variant="outlined"
              style={{marginTop: '40px'}}
            />
            <FormControl variant="outlined" className={classes.formControl} style={{marginTop: '40px'}}>
              <InputLabel htmlFor="outlined-age-native-simple">Max users</InputLabel>
              <Select
                native
                value={userNum}
                onChange={(e) => setUserNum(e.target.value)}
                label="userNum"
                inputProps={{
                  name: 'userNum',
                  id: 'outlined-age-native-simple',
                }}
              >
                <option value="- Unlimited -">- Unlimited -</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
              </Select>
            </FormControl>
            <TextField 
              id="outlined-password" 
              label="Password" 
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              style={{marginTop: '40px', marginBottom: '25px'}} 
            />
          </Paper>
          <Paper elevation={3} className={classes.media}>
            <h5>
              Media
            </h5>
            <hr className={classes.headLine} style={{marginTop:'10px', }} />
            <div>
              <img className={classes.mediaImage} width="100px" src="/img/avatars/default_avatar.png" alt="Card img cap" />
              <p>Upload a room icon</p>
            </div>
            <div className={classes.fileupload}>
              <TextField
                name="upload-photo"
                type="file"
              />
              <p style={{marginTop:'5px'}}>
                This icon will display on your chat room page and chat sidebar. <strong>160x160 is the recommended size for this image.</strong>
              </p>
            </div>
            <p style={{marginTop:'8px'}}>Upload a room icon</p>
            <div className={classes.fileupload}>
              <TextField
                name="upload-photo"
                type="file"
              />
              <p style={{marginTop:'5px'}}>
                This image will show up at the top of your chat room page. <strong>800x200 is the recommended size for this image.</strong>
              </p>
            </div>
          </Paper>
          <Paper elevation={3} className={classes.media}>
            <h5>
              Moderators
            </h5>
            <hr className={classes.headLine} style={{marginTop:'10px', }} />
            <TextField 
              id="outlined-moderator" 
              label="Add Moderator" 
              variant="outlined" 
              value={moderator}
              onChange={(e) => setModerator(e.target.value)}
              style={{marginTop: '40px'}} 
            />
            <Button variant="contained" color="primary" className={classes.button} >
              <AddCircleIcon />
              &nbsp; Add
            </Button>
          </Paper>
          <Paper elevation={3} className={classes.media}>
            <h5>
              Banned Users
            </h5>
            <hr className={classes.headLine} style={{marginTop:'10px', }} />
            <div style={{margin: '45px'}}>
            </div>
          </Paper>
        </Grid>
        <div style={{marginBottom: '50px'}}>
          <Button type="submit" variant="contained" color="primary" className={classes.button} >
            Save Changes
          </Button>
        </div>
      </Grid>
    </form>
  );
}
