import React, { useEffect, useReducer, useRef } from "react";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Switch from '@material-ui/core/Switch';
// core components
import GridItem from "Admin/components/Grid/GridItem.js";
import GridContainer from "Admin/components/Grid/GridContainer.js";
import Card from "Admin/components/Card/Card.js";
import CardHeader from "Admin/components/Card/CardHeader.js";
import CardIcon from "Admin/components/Card/CardIcon.js";
import CardFooter from "Admin/components/Card/CardFooter.js";
import FormattedInputs from "Admin/components/FormattedInputs/FormattedInputs.js";
import Button from "Admin/components/CustomButtons/Button.js";

import axios from 'axios';
import config from '../../../config'
import  ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';
import { useToasts } from 'react-toast-notifications';

import styles from "Admin/assets/jss/material-dashboard-react/views/bootCreateStyle.js";

const useStyles = makeStyles(styles);

function editReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      return {status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      return {status: 'rejected', data: null, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

const useGift = (initialState) => {
  const [state, dispatch] = useReducer(editReducer, {
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
          dispatch({ type: 'rejected', error: 'no gift' })
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

export default function Edit( {onClose, row} ) {
  const { addToast } = useToasts();
  const { data, status, error, run, dispatch } = useGift();
  const classes = useStyles();
  const hiddenFileInput = useRef(null)

  const onSubmit = async () => {
    if (status !== 'resolved' || !data) {
      return;
    }
    const { _id, name, detail, cost, src, srcFile } = data;
    try {
      const formData = new FormData();
      formData.append('_id', _id);
      formData.append('name', name);
      formData.append('detail', detail);
      formData.append('cost', cost);
      formData.append('gift_file', srcFile);
      
      let token = window.localStorage.getItem('token');
      axios.post(`${config.server_url}/api/gift/edit`, formData,
        {
        headers: {
          authorization: token,
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
          if(response && response.status === 204) {
              addToast('Successfully updated', { appearance: 'success' });
              onClose();
          }
      })
    } catch (err) {
        console.log(err);
        addToast('Can not create this boot', { appearance: 'error' });
        onClose();
    }
  }

  const handleChange = (e) => {
    const newData = { ...data };
    newData[e.target.name] = e.target.value;
    dispatch({ type: 'resolved', data: newData});

  }

  const handleChangeGiftFile = (event) => {
    const fileUploaded = event.target.files[0];
    if(fileUploaded) {
      const newData = { ...data };
      newData.src = fileUploaded.name;
      newData.srcFile = fileUploaded;
      dispatch({ type: 'resolved', data: newData });
    }
  }

  const handleClickGiftFile = () => {
    hiddenFileInput.current.click();
  }

  useEffect(() => {
    if (row) {
      dispatch({ type: 'resolved', data: row });
    }
  }, [row])

  if (status === 'idle') {
    return null
  } else if (status === 'pending') {
    return (
      <div>
        Loading
      </div>
    )
  } else if ( status === 'rejected') {
    return (
      <div>
        {error}
      </div>
    )
  } else if (status === 'resolved'){
    const { name, detail, cost, src } = data;
    return (
      <GridContainer>
        <GridItem xs={12} sm={8} md={8}>
          <Card>
            <CardHeader color="warning" icon>
              <CardIcon color="rose">
                <PersonOutlineIcon />
              </CardIcon>
              <p className={classes.cardCategory} style={{color:'#3c4858', fontSize:'20px', paddingTop:'16px',}}>Edit Gift</p>
            </CardHeader>
            <CardFooter style={{display: 'block'}}>
              <Grid container spacing={2} style={{marginTop:'20px'}}>
                <Grid item sm={1}>
                </Grid>
                <Grid item sm={2} style={{textAlign: 'right'}}>
                  <p className={classes.cardCategory}>Name</p>
                </Grid>
                <Grid item sm={9}>
                  <TextField style={{width: '100%'}} value={name} name='name' onChange={handleChange} />
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{marginTop:'20px'}}>
                <Grid item sm={1}>
                </Grid>
                <Grid item sm={2} style={{textAlign: 'right'}}>
                  <p className={classes.cardCategory}>Cost</p>
                </Grid>
                <Grid item sm={9}>
                  <TextField style={{width: '100%'}} type='number' value={cost} name='cost' onChange={handleChange} />
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{marginTop:'20px'}}>
                <Grid item sm={1}>
                </Grid>
                <Grid item sm={2} style={{textAlign: 'right'}}>
                  <p className={classes.cardCategory}>Detail</p>
                </Grid>
                <Grid item sm={9}>
                  <TextField style={{width: '100%'}} type='text' multiline value={detail} name='detail' onChange={handleChange} />
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{marginTop:'20px'}}>
                <Grid item sm={1}>
                </Grid>
                <Grid item sm={2} style={{textAlign: 'right'}}>
                  <p className={classes.cardCategory}>Gift File</p>
                </Grid>
                <Grid item sm={9}>
                  <input
                      type="file"
                      ref={hiddenFileInput}
                      onChange={handleChangeGiftFile}
                      style={{display: 'none'}} 
                  />
                  <Input className={classes.name}
                    value={src} disabled inputProps={{ 'aria-label': 'file-name' }} />
                  <Button className={classes.uploadButton}
                    type='button' variant="outlined" color="primary" component="span"
                    onClick={handleClickGiftFile}
                  >
                    Select File
                  </Button>
                </Grid>
              </Grid>
              <div style={{display:'flex', justifyContent:'space-between', marginTop: '20px', marginBottom: '20px'}}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => {onClose()}}
                >
                  Back
                </Button>
                <Button 
                  variant="contained" 
                  color="rose"
                  onClick={() => {onSubmit()}}
                >
                  Update
                </Button>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    );
  } else {
    return (
      <div>
        Unknown status
      </div>
    )
  }
}
