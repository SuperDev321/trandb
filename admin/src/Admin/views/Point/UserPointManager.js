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

export default function UserPointManager() {
  // donfsdodifj
  const classes = useStyles();
  const { addToast } = useToasts();
  const [users, setUsers] = useState([]);
  const [userForPoint, setUserForPoint] = useState(null);
  const [point, setPoint] = useState(0);

  const getUsers = React.useCallback(() => {
    let token = window.localStorage.getItem('token');

    Axios.get(`${config.server_url}/api/users`, {
      headers: {
        authorization: token
      }
    })
    .then((response) => {
      if (response.status === 200) {
        const { users } = response.data;
        if (users) {
            setUsers(users);
        }
      }
    })
  }, [])

  const changeUserForPoint = (username) => {
    const user = users.find((item) => {
      if (item.username === username) {
        return item;
      }
    });
    if (user) {
      setUserForPoint(user);
    }
  }

  const handleGivePoint = () => {
    if (userForPoint) {
      const { _id } = userForPoint;
      const token = window.localStorage.getItem('token');

      Axios.post(`${config.server_url}/api/user/update/point`, {
        point,
        _id
      }, {
        headers: {
          authorization: token
        }
      })
      .then((response) => {
        if (response.status === 204) {
          addToast('Successfully updated', { appearance: 'success' });
        } else {
          addToast('Update Failed', { appearance: 'error' });
        }
      })
      .catch(() => {
        addToast('Update Failed', { appearance: 'error' });
      })
    }
  }

  useEffect(() => {
    getUsers()
  }, []);

  useEffect(() => {
    if (userForPoint) {
      const { point } = userForPoint;
      if (point) 
        setPoint(point);
      else
        setPoint(0)
    }
  }, [userForPoint])

  const usernames = users.map(({username}) => (username));

  return (
    <Paper className={classes.paper}>
      <Card>
        <CardHeader color="warning" icon>
          <CardIcon color="primary">
            <AssignmentIcon />
          </CardIcon>
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <p className={classes.cardCategory} style={{color:'#3c4858', fontSize:'20px', paddingTop:'16px'}}>
              Give Points For Users
            </p>
          </div>
        </CardHeader>
        <CardFooter style={{display: 'block'}}>
            <Grid container spacing={2} style={{marginBottom:'10px'}}>
                <Grid item sm={1}>
                </Grid>
                <Grid item sm={2}>
                  <p className={classes.cardCategory}>User:</p>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid item xs={12} sm={6}>
                      <Autocomplete
                          id="users"
                          style={{ width: 300 }}
                          options={usernames}
                          onChange={(e, value) => changeUserForPoint(value)}
                          renderInput={(params) => <TextField {...params} label="Select user to give points" margin="normal" />}
                      />
                  </Grid>
                </Grid>
                <Grid item sm={3}>
                </Grid>
                <Grid item sm={1}>
                </Grid>
                <Grid item sm={2}>
                  <p className={classes.cardCategory}>Point For User ($)</p>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type='number'
                    style={{width: 300}}
                    value={point}
                    onChange={(e) => setPoint(e.target.value)}
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
                        onClick={() => {handleGivePoint()}}
                    >
                        Give Point
                    </Button>
                </Grid>
          </Grid>
        </CardFooter>
      </Card>
    </Paper>
  );
}
