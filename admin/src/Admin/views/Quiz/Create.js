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
  const [content, setContent] = React.useState('');
  const [answer, setAnswer] = React.useState('');
  const onSubmit = async () => {
    let payload = {};
    if(content==='') {
      addToast('Please fill content field', { appearance: 'error' });
      return;
    }
    try {
        const {data: {data}} = await axios.post(`${config.server_url}/api/boot`, {
          content
        });
        onClose();
    } catch (err) {
        addToast('Can not create this boot', { appearance: 'error' });
        onClose();
    }
  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={8} md={8}>
        <Card>
          <CardHeader color="warning" icon>
            <CardIcon color="rose">
              <PersonOutlineIcon />
            </CardIcon>
            <p className={classes.cardCategory} style={{color:'#3c4858', fontSize:'20px', paddingTop:'16px',}}>Create A New Forbidden Word</p>
          </CardHeader>
          <CardFooter style={{display: 'block'}}>
            <Grid container spacing={2} style={{marginTop:'20px'}}>
              <Grid item sm={1}>
              </Grid>
              <Grid item sm={2} style={{textAlign: 'right'}}>
                <p className={classes.cardCategory}>Content</p>
              </Grid>
              <Grid item sm={9}>
                <TextField style={{width: '100%'}} value={content} onChange={(e)=>{setContent(e.target.value)}} />
              </Grid>
            </Grid>
            {/* <Grid container spacing={2} style={{marginTop:'20px'}}>
              <Grid item sm={1}>
              </Grid>
              <Grid item sm={2} style={{textAlign: 'right'}}>
                <p className={classes.cardCategory}>Answer</p>
              </Grid>
              <Grid item sm={9}>
                <TextField style={{width: '100%'}} value={answer} onChange={(e)=>{setAnswer(e.target.value)}} />
              </Grid>
            </Grid> */}
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
