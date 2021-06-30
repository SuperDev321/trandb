import React, {useState, useRef} from "react";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
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
import  ColorPicker from 'rc-color-picker';
import axios from 'axios';
import config from '../../../config'
import 'rc-color-picker/assets/index.css';
import { useToasts } from 'react-toast-notifications';

import styles from "Admin/assets/jss/material-dashboard-react/views/bootCreateStyle.js";
import { MenuItem, Input } from "@material-ui/core";

const useStyles = makeStyles(styles);

export default function Create( {onClose} ) {
  const { addToast } = useToasts();
  const [name, setName] = React.useState('');
  const [cost, setCost] = React.useState(16);
  const [detail, setDetail] = React.useState('');
  const [giftFile, setGiftFile] = React.useState(null);
  const [giftImageFile, setGiftImageFile] = React.useState(null);
  const [fileName, setFileName] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const hiddenFileInput = useRef(null);
  const hiddenImageFileInput = useRef(null);

  const handleClickGiftFile = () => {
    hiddenFileInput.current.click();
  }

  const handleChangeGiftFile = event => {
    const fileUploaded = event.target.files[0];
    if(fileUploaded) {
        setFileName(fileUploaded.name);
        setGiftFile(fileUploaded);
    }
  };

  const handleClickGiftImageFile = () => {
    hiddenImageFileInput.current.click();
  }

  const handleChangeGiftImageFile = event => {
    const fileUploaded = event.target.files[0];
    if(fileUploaded) {
      setImageFileName(fileUploaded.name);
      setGiftImageFile(fileUploaded);
    }
  };

  const classes = useStyles();
  const onSubmit = async () => {
    if(name==='') {
      addToast('Please fill content field', { appearance: 'error' });
      return;
    }
    try {
      let token = window.localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', name);
      formData.append('detail', detail);
      formData.append('cost', cost);
      formData.append('gift_file', giftFile)
      formData.append('gift_image_file', giftImageFile)
      console.log(giftFile)
      const {data: {data}} = await axios.post(`${config.server_url}/api/gift`, formData, {
        headers: {
          authorization: token,
          'Content-type': 'multipart/form-data'
        }
      });
      onClose();
    } catch (err) {
        addToast('Can not create this gift', { appearance: 'error' });
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
            <p className={classes.cardCategory} style={{color:'#3c4858', fontSize:'20px', paddingTop:'16px',}}>Create A New Gift</p>
          </CardHeader>
          <CardFooter style={{display: 'block'}}>
            <Grid container spacing={2} style={{marginTop:'20px'}}>
              <Grid item sm={1}>
              </Grid>
              <Grid item sm={2} style={{textAlign: 'right'}}>
                <p className={classes.cardCategory}>Name</p>
              </Grid>
              <Grid item sm={9}>
                <TextField style={{width: '100%'}} value={name} className={classes.name} onChange={(e)=>{setName(e.target.value)}} />
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{marginTop:'20px'}}>
              <Grid item sm={1}>
              </Grid>
              <Grid item sm={2} style={{textAlign: 'right'}}>
                <p className={classes.cardCategory}>Cost</p>
              </Grid>
              <Grid item sm={9}>
                <TextField style={{width: '100%'}} type='number' value={cost} onChange={(e)=>{setCost(Number(e.target.value));}} />
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{marginTop:'20px'}}>
              <Grid item sm={1}>
              </Grid>
              <Grid item sm={2} style={{textAlign: 'right'}}>
                <p className={classes.cardCategory}>Detail</p>
              </Grid>
              <Grid item sm={9}>
                <TextField style={{width: '100%'}} type='text' multiline value={detail} onChange={(e)=>{setDetail(e.target.value);}} />
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{marginTop:'20px'}}>
              <Grid item sm={1}>
              </Grid>
              <Grid item sm={2} style={{textAlign: 'right'}}>
                <p className={classes.cardCategory}>Gift File (MP4)</p>
              </Grid>
              <Grid item sm={9}>
                <input
                    type="file"
                    ref={hiddenFileInput}
                    onChange={handleChangeGiftFile}
                    style={{display: 'none'}} 
                />
                <Input className={classes.name}
                  value={fileName} disabled inputProps={{ 'aria-label': 'file-name' }} />
                <Button className={classes.uploadButton}
                  type='button' onClick={handleClickGiftFile} variant="outlined" color="primary" component="span">
                  Select File
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{marginTop:'20px'}}>
              <Grid item sm={1}>
              </Grid>
              <Grid item sm={2} style={{textAlign: 'right'}}>
                <p className={classes.cardCategory}>Gift Image File</p>
              </Grid>
              <Grid item sm={9}>
                <input
                    type="file"
                    ref={hiddenImageFileInput}
                    onChange={handleChangeGiftImageFile}
                    style={{display: 'none'}} 
                />
                <Input className={classes.name}
                  value={imageFileName} disabled inputProps={{ 'aria-label': 'file-name' }} />
                <Button className={classes.uploadButton}
                  type='button' onClick={handleClickGiftImageFile} variant="outlined" color="primary" component="span">
                  Select File
                </Button>
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
