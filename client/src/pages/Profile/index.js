import React, {useState, useEffect} from "react";
// import { Link } from "react-router-dom";
// import Axios from "axios";
import {
  Paper,
  Button,
  Grid,
  Container
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import { Settings, Edit } from '@material-ui/icons';
import useStyles from './styles'
import { getUserDetail } from "../../utils";
import { useHistory, useParams } from "react-router-dom";

export default function Profile() {
  const {username} = useParams();
  const classes = useStyles();

  const [gender, setGender] = useState('');
  const [rooms, setRooms] = useState([]);

  const handleSetting = (roomName) => {
    window.open('/setting/room/'+ roomName);
  }

  useEffect(() => {
    getUserDetail(username, (data) => {
      console.log(data)
      if(data.rooms) {
        setRooms(data.rooms);
      }
      if(data.gender) {
        setGender(data.gender)
      }
    }, () => {

    });
  }, [username])

  return (
    <Container>
    {/* <form className={classes.root} noValidate autoComplete="off"> */}
      <Grid container spacing={4} style={{marginTop: '12px'}}>
        <Grid item xs={12} sm={3}>
          <Paper elevation={3} className={classes.avatar}>
            <img className={classes.roundedCircle} width="100px" src="/img/default_avatar.png" alt="Card img cap" />
            <p className={classes.avatarName}>{username}</p>
          </Paper>
          <Paper elevation={3} className={classes.about}>
            <div className={classes.aboutTitle}>About</div>
            <div className={classes.aboutBody}>
              <PersonIcon />
              <p>{gender}</p>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} className={classes.general}>
            <p className={classes.titleName}>
              {username}
            </p>
            <hr className={classes.headLine} style={{marginTop:'10px', }} />
            <div className={classes.aboutBody} style={{marginTop: '40px'}}>
              <BookmarksIcon /> &nbsp; &nbsp;
              <p className={classes.title}>Badges</p>
            </div>
            <div>
              <CheckCircleIcon color="primary" />
            </div>
            <div className={classes.aboutBody}>
              <CardGiftcardIcon /> &nbsp; &nbsp;
              <p className={classes.title}>Joined</p>
            </div>
            <p>2020-08-14T13:02:56.000Z</p>
            <Button size="small" variant="outlined" color="primary" size='small' style={{width: 'inherit'}}
                startIcon={<Edit/>}
              >
                Edit Profile
            </Button>
          </Paper>
          <Paper elevation={3} className={classes.room}>
            <h5>
              Rooms
            </h5>
            <hr className={classes.headLine} style={{marginTop:'10px', }} />
            { rooms.length ? rooms.map((room) =>
            <div key={room._id} className={classes.roomBody}>
              <p className={classes.title}>{room.name}</p>
              <Button size="small" variant="outlined" color="primary" size='small'
                startIcon={<Settings/>}
                onClick={() => handleSetting(room.name)}
              >
                Setting
              </Button>
              
            </div>
            ): (null)
            }
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={3}>
          <Paper elevation={3} className={classes.rightSide}>
            <p>©2019 Trand Chat Ltd </p>
          </Paper>
        </Grid>
      </Grid>
    {/* </form> */}
    </Container>
  );
}
