import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';                                                                                   
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Card from "Admin/components/Card/Card.js";
import CardHeader from "Admin/components/Card/CardHeader.js";
import CardIcon from "Admin/components/Card/CardIcon.js";
import CardFooter from "Admin/components/Card/CardFooter.js";
import AssignmentIcon from '@material-ui/icons/Assignment';
import Grid from '@material-ui/core/Grid';
import SearchBar from 'material-ui-search-bar';
import Button from "Admin/components/CustomButtons/Button.js";
import config from '../../../config'
import { useToasts } from 'react-toast-notifications';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  botState: {
    fontSize: 20
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

export default function RunQuiz() {
  // donfsdodifj
  const classes = useStyles();
  const { addToast } = useToasts();
  const [botRoom, setBotRoom] = useState(null);
  const [activeRooms, setActiveRooms] = useState([]);
  const [bootInterval, setBootInterval] = useState(10);

  const handleStart = () => {
    Axios.post(`${config.server_url}/api/boot/start`, {
      room: botRoom,
      interval: bootInterval
    })
    .then((response) => {
      if(response.status === 204) {
        addToast('Successfully started', { appearance: 'success' });
      }
    })
  }

  const handleStop = () => {
    Axios.post(`${config.server_url}/api/boot/stop`, {
      room: botRoom
    })
    .then((response) => {
      if(response.status === 204) {
        addToast('Successfully stoped', { appearance: 'success' });
      }
    })
  }

  useEffect(() => {
    Axios.get(`${config.server_url}/api/room/names`)
    .then((response) => {
        if(response.status === 200) {
            if(response.data && Array.isArray(response.data.rooms)) {
                let {rooms} = response.data;
                let roomNames = rooms.map((room) => (room.name));
                setActiveRooms(roomNames)
            }
        }
    })
  }, [])

  return (
  	<Paper className={classes.paper}>
	    <Card>
	      <CardHeader color="warning" icon>
	        <CardIcon color="primary">
	          <AssignmentIcon />
	        </CardIcon>
	        <div style={{display:'flex', justifyContent:'space-between'}}>
	        <p className={classes.cardCategory}>Boot Message Setting</p>
	        </div>
	      </CardHeader>
	      <CardFooter style={{display: 'block'}}>
	        {/* <Grid container spacing={2} style={{marginBottom:'10px',}}>
                <Grid item sm={2}>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <div className={classes.botState}>
                        { botRoom 
                            ? `Quiz bot is Running on ${botRoom}`
                            : 'Quiz bot turned off'
                        }
                        
                    </div>
                </Grid>
	        </Grid> */}
            <Grid container spacing={2} style={{marginBottom:'10px'}}>
                <Grid item sm={2}>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Autocomplete
                        id="rooms"
                        style={{ width: 300 }}
                        options={activeRooms}
                        onChange={(e, value) => setBotRoom(value)}
                        renderInput={(params) => <TextField {...params} label="Select room for Quiz bot" margin="normal" />}
                    />
                </Grid>
                <Grid item sm={4}>
                </Grid>
                <Grid item sm={2}>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                      type='number'
                      style={{width: 300}}
                      value={bootInterval}
                      onChange={(e) => setBootInterval(e.target.value)}
                    />
                </Grid>
                <Grid item sm={4}>
                </Grid>
                <Grid item sm={2}>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button
                        variant="contained" 
                        color="primary"
                        onClick={() => {handleStart()}}
                    >
                        Start Boot
                    </Button>
                    <Button
                        variant="contained" 
                        color="warning"
                        onClick={() => {handleStop()}}
                    >
                        Stop Boot
                    </Button>
                </Grid>
	        </Grid>
	      </CardFooter>
	    </Card>
  	</Paper>
  );

}
