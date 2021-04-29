import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import RoomContext from './context'
import {
    Autocomplete
} from '@material-ui/lab';                                                                                   
import {
    Paper,
    TextField,
    Grid,
    Select,
    Input,
    FormControl,
    InputLabel,
    MenuItem
} from '@material-ui/core';
import Card from "Admin/components/Card/Card.js";
import CardHeader from "Admin/components/Card/CardHeader.js";
import CardIcon from "Admin/components/Card/CardIcon.js";
import CardFooter from "Admin/components/Card/CardFooter.js";
import AssignmentIcon from '@material-ui/icons/Assignment';
import SearchBar from 'material-ui-search-bar';
import Button from "Admin/components/CustomButtons/Button.js";
import config from '../../../config'
import { useToasts } from 'react-toast-notifications';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  botState: {
    fontSize: 20
  },
  formControl: {
    minWidth: 120,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  cardCategory: {
    color: '#3C4858',
    margin: "0",
    fontSize: "35px",
    marginTop: "0",
    paddingTop: "15px",
    marginBottom: "10px"
  },
}));

export default function RoomSelector() {
  // donfsdodifj
  const classes = useStyles();
  const { addToast } = useToasts();
  const {type: roomType, setType: setRoomType, room, setRoom, setFrom, setTo, to, from} = useContext(RoomContext);
  const [botRoom, setBotRoom] = useState(null);
  const [activeRooms, setActiveRooms] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    if(roomType === 'public') {
        Axios.get(`${config.server_url}/api/room/names`)
        .then((response) => {
            if(response.status === 200) {
                console.log(response.data)
                if(response.data && Array.isArray(response.data.rooms)) {
                    let {rooms} = response.data;
                    let roomNames = rooms.map((room) => (room.name));
                    console.log(roomNames)
                    setActiveRooms(roomNames)
                }
            }
        })
    } else if(roomType === 'private') {
        Axios.get(`${config.server_url}/api/users`)
        .then((response) => {
            if(response.status === 200) {
                console.log(response.data)
                if(response.data && Array.isArray(response.data.users)) {
                    let {users} = response.data;
                    let userNames = users.map((user) => (user.username));
                    console.log(userNames)
                    setActiveUsers(userNames)
                }
            }
        })
    }
  }, [roomType])

  return (
  	<Paper className={classes.paper}>
	    <Card>
            <CardHeader color="warning" icon>
                <CardIcon color="primary">
                <AssignmentIcon />
                </CardIcon>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                <p className={classes.cardCategory}>Room Select</p>
                </div>
            </CardHeader>
            <CardFooter style={{display: 'block'}}>
                <Grid container spacing={2} style={{marginBottom:'10px',}}>
                    <Grid item sm={2}>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="room-type-label">Room Type</InputLabel>
                            <Select
                                labelId="room-type-label"
                                id="room-type-name"
                                value={roomType}
                                onChange={(e) => setRoomType(e.target.value)}
                                input={<Input />}
                            >
                                <MenuItem value='public'>
                                    Public
                                </MenuItem>
                                <MenuItem value='private'>
                                    Private
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={2} style={{marginBottom:'10px'}}>
                    { roomType === 'public' ?
                    <>
                        <Grid item sm={2}>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                id="rooms"
                                style={{ width: 300 }}
                                options={activeRooms}
                                value={room}
                                onChange={(e, value) => {setRoom(value); console.log(value)}}
                                renderInput={(params) => <TextField {...params} label="Select room for Logs" margin="normal" />}
                            />
                        </Grid>
                    </>
                    :
                    <>
                        <Grid item sm={2}>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <Autocomplete
                                id="from_users"
                                style={{ width: 300 }}
                                options={activeUsers}
                                value={from}
                                onChange={(e, value) => {setFrom(value)}}
                                renderInput={(params) => <TextField {...params} label="Select user 1 " margin="normal" />}
                            />
                        </Grid>
                        {/* <Grid item sm={4}>
                        </Grid>
                        <Grid item sm={2}>
                        </Grid> */}
                        <Grid item xs={12} sm={5}>
                            <Autocomplete
                                id="to_users"
                                style={{ width: 300 }}
                                options={activeUsers}
                                value={to}
                                onChange={(e, value) => {setTo(value)}}
                                renderInput={(params) => <TextField {...params} label="Select user 2" margin="normal" />}
                            />
                        </Grid>
                    </>
                    }
                    {/* <Grid item xs={12} sm={4}>
                        <Button
                            variant="contained" 
                            color="primary"
                        >
                            View Logs
                        </Button>
                    </Grid> */}
                </Grid>
            </CardFooter>
	    </Card>
  	</Paper>
  );

}
