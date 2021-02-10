import React from "react";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
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

import { useToasts } from 'react-toast-notifications';

import styles from "Admin/assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

export default function Create( {onClose} ) {
  const classes = useStyles();
  const { addToast } = useToasts();
  const [username, setUsername] = React.useState('');
  const [bantype, setBantype] = React.useState('ip');
  const [ip, setIp] = React.useState('');
  const [fromIp, setFromIp] = React.useState('');
  const [toIp, setToIp] = React.useState('');

  const onSubmit = async () => {
    let payload = {};
    if(username==='') {
      addToast('Please fill nickname field', { appearance: 'error' });
      return;
    }
    payload.username = username;
    if(bantype==='ip') {
      if(ip==='' || ip.indexOf('_')>0) {
        addToast('Please fill IP filed', { appearance: 'error' });
        return;
      }
      payload.ip = ip;
    } else if(bantype === 'range') {
      if(fromIp==='' || fromIp.indexOf('_')>0||toIp==='' || toIp.indexOf('_')>0) {
        addToast('Please fill IP fileds', { appearance: 'error' });
        return;
      }
      payload.fromIp = fromIp;
      payload.toIp = toIp;
    }
    const {data: {data}} = await axios.post(`${config.server_url}/api/bans`, payload);
    onClose();
  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={8} md={8}>
        <Card>
          <CardHeader color="warning" icon>
            <CardIcon color="rose">
              <PersonOutlineIcon />
            </CardIcon>
            <p className={classes.cardCategory} style={{color:'#3c4858', fontSize:'20px', paddingTop:'16px',}}>Create New Ban User -</p>
          </CardHeader>
          <CardFooter style={{display: 'block'}}>
            <Grid container spacing={2} style={{marginTop:'20px'}}>
              <Grid item sm={1}>
              </Grid>
              <Grid item sm={2} style={{textAlign: 'right'}}>
                <p className={classes.cardCategory}>Nickname</p>
              </Grid>
              <Grid item sm={9}>
                <TextField style={{width: '100%'}} value={username} onChange={(e)=>{setUsername(e.target.value)}} />
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{marginTop:'20px'}}>
              <Grid item sm={1}>
              </Grid>
              <Grid item sm={2} style={{textAlign: 'right'}}>
                <p className={classes.cardCategory}>Ban Type</p>
              </Grid>
              <Grid item sm={9}>
                <FormControl style={{width: '100%'}}>
                  <Select
                    native
                    value={bantype}
                    onChange={(e) => setBantype(e.target.value)}
                    label="bantype*"
                    inputProps={{
                      name: 'bantype',
                      id: 'bantype',
                    }}
                  >
                    <option value="ip">ip</option>
                    <option value="range">range</option>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {bantype === 'ip'? 
            <Grid container spacing={2} style={{marginTop:'20px'}}>
              <Grid item sm={1}>
              </Grid>
              <Grid item sm={2} style={{textAlign: 'right'}}>
                <p className={classes.cardCategory}>Ip</p>
              </Grid>
              <Grid item sm={9}>
                <FormattedInputs
                  value={ip}
                  onChange={(e) => {setIp(e.target.value)}}
                />
              </Grid>
            </Grid>
            : null}
            {bantype === 'range'? 
            <Grid container spacing={2} style={{marginTop:'20px'}}>
              <Grid item sm={1}>
              </Grid>
              <Grid item sm={2} style={{textAlign: 'right'}}>
                <p className={classes.cardCategory}>Range</p>
              </Grid>
              <Grid item sm={9}>
                <FormattedInputs textLabel="From"
                  value={fromIp}
                  onChange={(e) => {setFromIp(e.target.value)}}
                />
                <FormattedInputs textLabel="To"
                  value={toIp}
                  onChange={(e) => {setToIp(e.target.value)}}
                />
              </Grid>
            </Grid>
            : null}
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
                Create
              </Button>
            </div>
          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
