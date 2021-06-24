import React, { useEffect } from "react";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
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

export default function Edit( {onClose, row} ) {
  const { addToast } = useToasts();
  const [content, setContent] = React.useState('');
  const [active, setActive] = React.useState(false);
  const [size, setSize] = React.useState(16);
  const [color, setColor] = React.useState('#fff');
  const [bold, setBold] = React.useState(false);
  const classes = useStyles({color, bold, size});
  const onSubmit = async () => {
    if(content==='') {
      addToast('Please fill content field', { appearance: 'error' });
      return;
    }
    try {
      let token = window.localStorage.getItem('token');
      axios.post(`${config.server_url}/api/boot/edit`, {
          _id: row._id,
          content,
          color,
          bold,
          size,
          active
      }, {
        headers: {
          authorization: token
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

  useEffect(() => {
    if(row && row.content && row._id) {
        let {content, color, size, bold, active} = row;
        setContent(content);
        setActive(active);
        setColor(color);
        setSize(size);
        setBold(bold);
    }
  }, [row])

  return (
    <GridContainer>
      <GridItem xs={12} sm={8} md={8}>
        <Card>
          <CardHeader color="warning" icon>
            <CardIcon color="rose">
              <PersonOutlineIcon />
            </CardIcon>
            <p className={classes.cardCategory} style={{color:'#3c4858', fontSize:'20px', paddingTop:'16px',}}>Edit Boot Message</p>
          </CardHeader>
          <CardFooter style={{display: 'block'}}>
            <Grid container spacing={2} style={{marginTop:'20px'}}>
              <Grid item sm={1}>
              </Grid>
              <Grid item sm={2} style={{textAlign: 'right'}}>
                <p className={classes.cardCategory}>Content</p>
              </Grid>
              <Grid item sm={9}>
                <TextField className={classes.content} style={{width: '100%'}} value={content} onChange={(e)=>{setContent(e.target.value)}} />
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{marginTop:'20px'}}>
              <Grid item sm={1}>
              </Grid>
              <Grid item sm={2} style={{textAlign: 'right'}}>
                <p className={classes.cardCategory}>Size</p>
              </Grid>
              <Grid item sm={9}>
                <TextField style={{width: '100%'}} type='number' value={size} onChange={(e)=>{setSize(Number(e.target.value));}} />
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{marginTop:'20px'}}>
              <Grid item sm={1}>
              </Grid>
              <Grid item sm={2} style={{textAlign: 'right'}}>
                <p className={classes.cardCategory}>Color</p>
              </Grid>
              <Grid item sm={9}>
                <FormControl style={{width: '100%', padding: 8}}>
                    <ColorPicker style={{padding: 8}} color={color} enableAlpha={false} onChange={(colors)=>{let {color}=colors; setColor(color)}}/>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{marginTop:'20px'}}>
              <Grid item sm={1}>
              </Grid>
              <Grid item sm={2} style={{textAlign: 'right'}}>
                <p className={classes.cardCategory}>Bold</p>
              </Grid>
              <Grid item sm={9}>
                <FormControl style={{width: '100%'}}>
                  <Switch
                      checked={bold}
                      onChange={(e) => setBold(e.target.checked)}
                      name="bold"
                      inputProps={{ 'aria-label': 'active boot' }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{marginTop:'20px'}}>
              <Grid item sm={1}>
              </Grid>
              <Grid item sm={2} style={{textAlign: 'right'}}>
                <p className={classes.cardCategory}>Active</p>
              </Grid>
              <Grid item sm={9}>
                <FormControl style={{width: '100%'}}>
                  <Switch
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                      name="active"
                      inputProps={{ 'aria-label': 'active boot' }}
                  />
                </FormControl>
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
                Update
              </Button>
            </div>
          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
