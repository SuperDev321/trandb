import React, { useEffect, useState } from "react";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import ChatIcon from '@material-ui/icons/Chat';
import AssignmentIcon from '@material-ui/icons/Assignment';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
// core components
import GridItem from "Admin/components/Grid/GridItem.js";
import GridContainer from "Admin/components/Grid/GridContainer.js";
import Card from "Admin/components/Card/Card.js";
import CardHeader from "Admin/components/Card/CardHeader.js";
import CardIcon from "Admin/components/Card/CardIcon.js";
import CardFooter from "Admin/components/Card/CardFooter.js";
import Button from "Admin/components/CustomButtons/Button.js";

import styles from "Admin/assets/jss/material-dashboard-react/views/dashboardStyle.js";
import Axios from "axios";
import config from "config";
import { useToasts } from 'react-toast-notifications';
const useStyles = makeStyles(styles);

export default function Setting() {
    const classes = useStyles();
    const [theme, setTheme] = useState('normal'); 
    const [language, setLanguage] = useState('en');
    const [messageNum, setMessageNum] = useState(20);
    const [allowPrivate, setAllowPrivate] = useState(false);
    const [messageTimeInterval, setMessageTimeInterval] = useState(200);
    const [maxUsernameLength, setMaxUsernameLength] = useState(20)
    const [maxMessageLength, setMaxMessageLength] = useState(20)
    const [guestAboutMe, setGuestAboutMe] = useState(true)
    const { addToast } = useToasts();

    useEffect(() => {
        let token = window.localStorage.getItem('token');
        Axios.get(`${config.server_url}/api/setting`, {
            headers: {
                authorization: token
            }
        })
        .then((response) => {
            if(response.status === 200) {
                const {theme, language, messageNum, allowPrivate, messageTimeInterval,
                    maxUsernameLength, maxMessageLength, guestAboutMe} = response.data;
                if(theme) {
                    setTheme(theme);
                }
                if(language) {
                    setLanguage(language);
                }
                if(messageNum) {
                    setMessageNum(messageNum)
                }
                if(allowPrivate) {
                    setAllowPrivate(true);
                } else {
                    setAllowPrivate(false);
                }
                if (messageTimeInterval) {
                    setMessageTimeInterval(messageTimeInterval)
                }
                if (maxUsernameLength) {
                    setMaxUsernameLength(maxUsernameLength)
                }
                if (maxMessageLength) {
                    setMaxMessageLength(maxMessageLength)
                }
                if (guestAboutMe) {
                    setGuestAboutMe(true)
                } else {
                    setGuestAboutMe(false)
                }
            }
        })
    }, [])

    const handleUpdate = () => {
        let token = window.localStorage.getItem('token');
        Axios.post(`${config.server_url}/api/setting`, {theme, language, messageNum, allowPrivate,
            messageTimeInterval, maxUsernameLength, maxMessageLength, guestAboutMe}, {
            headers: {
                authorization: token
            }
        })
        .then((response) => {
            if(response.status === 204) {
                addToast('Successfully updated', {appearance: 'success'});
            }
        })
    }

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                <CardHeader color="warning" icon>
                    <CardIcon color="rose">
                    <ChatIcon />
                    </CardIcon>
                    <p className={classes.cardCategory} style={{paddingTop:'20px',}}>
                    <span style={{color:'#3c4858', fontSize:'20px',}}>Admin Setting - </span>
                    <span style={{paddingTop:'16px',}}>Update setting</span>
                    </p>
                </CardHeader>
                <CardFooter style={{display: 'block'}}>
                    <Grid container spacing={2} style={{marginTop:'20px'}}>
                        <Grid item sm={1}>
                        </Grid>
                        <Grid item sm={2} style={{textAlign: 'right'}}>
                            <p className={classes.cardCategory}>Theme</p>
                        </Grid>
                        <Grid item sm={9}>
                            <FormControl style={{width: '100%'}}>
                                <Select
                                    native
                                    value={theme}
                                    onChange={(e) => setTheme(e.target.value)}
                                    label="Theme"
                                    inputProps={{
                                    name: 'theme',
                                    id: 'theme',
                                    }}
                                >
                                    {/* <option aria-label="None" value="" /> */}
                                    <option value="normal">light</option>
                                    <option value="dark">dark</option>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} style={{marginTop:'20px'}}>
                        <Grid item sm={1}>
                        </Grid>
                        <Grid item sm={2} style={{textAlign: 'right'}}>
                            <p className={classes.cardCategory}>Language</p>
                        </Grid>
                       <Grid item sm={9}>
                            <FormControl style={{width: '100%'}}>
                                <Select
                                    native
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    label="Language"
                                    inputProps={{
                                    name: 'language',
                                    id: 'language',
                                    }}
                                >
                                    {/* <option aria-label="None" value="" /> */}
                                    <option value="en">English</option>
                                    <option value="iw">Hebrew</option>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} style={{marginTop:'20px'}}>
                        <Grid item sm={1}>
                        </Grid>
                        <Grid item sm={2} style={{textAlign: 'right'}}>
                            <p className={classes.cardCategory}>Number of Message</p>
                        </Grid>
                        <Grid item sm={9}>
                            <FormControl style={{width: '100%'}}>
                                <Select
                                    native
                                    value={messageNum}
                                    onChange={(e) => setMessageNum(e.target.value)}
                                    label="MessageNum"
                                    inputProps={{
                                    name: 'messageNum',
                                    id: 'messageNum',
                                    }}
                                >
                                    {/* <option aria-label="None" value="" /> */}
                                    <option value={20}>20</option>
                                    <option value={30}>30</option>
                                    <option value={40}>40</option>
                                    <option value={50}>50</option>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} style={{marginTop:'20px'}}>
                        <Grid item sm={1}>
                        </Grid>
                        <Grid item sm={2} style={{textAlign: 'right'}}>
                            <p className={classes.cardCategory}>Private Allow to Guest</p>
                        </Grid>
                        <Grid item sm={9}>
                            <FormControl style={{width: '100%'}}>
                            <Switch
                                checked={allowPrivate}
                                onChange={(e) => setAllowPrivate(e.target.checked)}
                                name="allowPrivate"
                                inputProps={{ 'aria-label': 'allow private' }}
                            />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} style={{marginTop:'20px'}}>
                        <Grid item sm={1}>
                        </Grid>
                        <Grid item sm={2} style={{textAlign: 'right'}}>
                            <p className={classes.cardCategory}>Show Guest About Me</p>
                        </Grid>
                        <Grid item sm={9}>
                            <FormControl style={{width: '100%'}}>
                            <Switch
                                checked={guestAboutMe}
                                onChange={(e) => setGuestAboutMe(e.target.checked)}
                                name="guestAboutMe"
                                inputProps={{ 'aria-label': 'guest about me' }}
                            />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} style={{marginTop:'20px'}}>
                        <Grid item sm={1}>
                        </Grid>
                        <Grid item sm={2} style={{textAlign: 'right'}}>
                            <p className={classes.cardCategory}>Message Time Interval</p>
                        </Grid>
                        <Grid item sm={9}>
                            <TextField
                                type='number'
                                style={{width: '100%'}}
                                value={messageTimeInterval}
                                onChange={(e) => setMessageTimeInterval(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} style={{marginTop:'20px'}}>
                        <Grid item sm={1}>
                        </Grid>
                        <Grid item sm={2} style={{textAlign: 'right'}}>
                            <p className={classes.cardCategory}>Max Username Length</p>
                        </Grid>
                        <Grid item sm={9}>
                            <TextField
                                type='number'
                                style={{width: '100%'}}
                                value={maxUsernameLength}
                                onChange={(e) => setMaxUsernameLength(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} style={{marginTop:'20px'}}>
                        <Grid item sm={1}>
                        </Grid>
                        <Grid item sm={2} style={{textAlign: 'right'}}>
                            <p className={classes.cardCategory}>Max Message Length</p>
                        </Grid>
                        <Grid item sm={9}>
                            <TextField
                                type='number'
                                style={{width: '100%'}}
                                value={maxMessageLength}
                                onChange={(e) => setMaxMessageLength(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <div style={{display:'flex', justifyContent:'space-between', marginTop: '20px', marginBottom: '20px'}}>
                    <Button 
                        variant="contained" 
                        color="rose"
                        onClick={handleUpdate}
                    >
                        Update Setting
                    </Button>
                    </div>
            </CardFooter>
            </Card>
        </GridItem>
        </GridContainer>
    );
}
