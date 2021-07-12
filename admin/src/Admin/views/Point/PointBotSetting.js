import React, { useEffect, useState, useReducer } from 'react';
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
import styles from "Admin/assets/jss/material-dashboard-react/views/dashboardStyle.js";
import asyncReducer from "../../../utils/asyncReducer";
import Loading from 'Admin/components/Loading';
const useStyles = makeStyles(styles);

const useSetting = (initialState) => {
  const [state, dispatch] = useReducer(asyncReducer, {
    data: null,
    status: 'idle',
    error: null,
    ...initialState
  });

  const run = React.useCallback((promise) => {
    if (!promise) {
      return;
    }
    dispatch({ type: 'pending' });
    promise
    .then((
      data => {
        if(data) {
            dispatch({ type: 'resolved', data })
        } else {
          dispatch({ type: 'rejected', error: 'no setting' })
        }
      },
      error => {
        dispatch({ type: 'rejected', error });
      }
    ))
  });

  const { data, status, error } = state;

  return {
    run,
    dispatch,
    data,
    error,
    status
  }
}

export default function PointBotSetting() {
  // donfsdodifj
  const classes = useStyles();
  const { addToast } = useToasts();
  const { run, data, error, status, dispatch } = useSetting();
  const [pointsPer, setPointsPer] = useState(10);
  const [bootInterval, setBootInterval] = useState(5);

  const getStatus = React.useCallback(() => {
    let token = window.localStorage.getItem('token');

    Axios.get(`${config.server_url}/api/point/status`, {
      headers: {
        authorization: token
      }
    })
    .then((response) => {
      if (response.status === 200) {
        const { status } = response.data;
        dispatch({ type: 'resolved', data: status });
        const { timeSpan, incValue } = status;
        if (timeSpan && incValue) {
          setPointsPer(incValue);
          setBootInterval(timeSpan);
        }
      }
    })
  }, [dispatch, setPointsPer, setBootInterval])

  const handleStart = () => {
    let token = window.localStorage.getItem('token');

    Axios.post(`${config.server_url}/api/point/start`, {
      timeSpan: bootInterval,
      incValue: pointsPer
    }, {
      headers: {
        authorization: token
      }
    })
    .then(() => {
      addToast('Successfully started', { appearance: 'success' });
      getStatus()
    })
  }

  const handleStop = () => {
    let token = window.localStorage.getItem('token');
    
    Axios.post(`${config.server_url}/api/point/stop`, {}, {
      headers: {
        authorization: token
      }
    })
    .then((response) => {
      if(response.status === 204) {
        addToast('Successfully stoped', { appearance: 'success' });
        getStatus()
      }
    })
  }

  useEffect(() => {
    

    getStatus();
  }, []);

  if (status === 'resolved') {
    const { timeSpan, incValue, running } = data;
    return (
      <Paper className={classes.paper}>
        <Card>
          <CardHeader color="warning" icon>
            <CardIcon color="primary">
              <AssignmentIcon />
            </CardIcon>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <p className={classes.cardCategory} style={{color:'#3c4858', fontSize:'20px', paddingTop:'16px'}}>Point Setting</p>
            </div>
          </CardHeader>
          <CardFooter style={{display: 'block'}}>
              <Grid container spacing={2} style={{marginBottom:'10px'}}>
                  <Grid item sm={1}>
                  </Grid>
                  <Grid item sm={2}>
                    <p className={classes.cardCategory}>status:</p>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    { running
                      ?
                      <p>
                        Point bot is running. Time: {timeSpan} Point per time: {incValue}
                      </p>
                      :
                      <p>
                        PointBot stopped.
                      </p>
                    }
                  </Grid>
                  <Grid item sm={3}>
                  </Grid>
                  <Grid item sm={1}>
                  </Grid>
                  <Grid item sm={2}>
                    <p className={classes.cardCategory}>Points per user ($)</p>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                      <TextField
                        type='number'
                        style={{width: 300}}
                        value={pointsPer}
                        onChange={(e) => setPointsPer(e.target.value)}
                      />
                  </Grid>
                  <Grid item sm={3}>
                  </Grid>
                  <Grid item sm={1}>
                  </Grid>
                  <Grid item sm={2}>
                    <p className={classes.cardCategory}>Time interval (min)</p>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                      <TextField
                        type='number'
                        style={{width: 300}}
                        value={bootInterval}
                        onChange={(e) => setBootInterval(e.target.value)}
                      />
                  </Grid>
                  <Grid item sm={3}>
                  </Grid>
                  <Grid item sm={2}>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                      <Button
                          variant="contained" 
                          color="primary"
                          onClick={() => {handleStart()}}
                      >
                          Start Point Bot
                      </Button>
                      <Button
                          variant="contained" 
                          color="warning"
                          onClick={() => {handleStop()}}
                      >
                          Stop Point Bot
                      </Button>
                  </Grid>
            </Grid>
          </CardFooter>
        </Card>
      </Paper>
    );
  } else {
    return (
      <Loading />
    )
  }

}
