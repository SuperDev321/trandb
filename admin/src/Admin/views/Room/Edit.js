import React, { useEffect, useState } from "react";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import ChatIcon from '@material-ui/icons/Chat';
import AssignmentIcon from '@material-ui/icons/Assignment';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
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
// table components
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import styles from "Admin/assets/jss/material-dashboard-react/views/dashboardStyle.js";
import Axios from "axios";
import config from "config";

const useStyles = makeStyles(styles);

export default function Edit( {onClickBack, room} ) {
  const classes = useStyles();
  const [id, setId] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [description, setDescription] = useState('');
  const [maxUsers, setMaxUsers] = useState(0);
  const [owner, setOwner] = useState(null);
  const [bans, setBans] = useState([]);
  const [moderators, setModerators] = useState([]);
  const [cover, setCover] = useState('');
  const [icon, setIcon] = useState('');

  const handleClickDeleteModerator = (moderatorId) => {
    if(id) {
      Axios.post(`${config.server_url}/api/moderators/delete`, {roomId: id, moderatorId})
      .then((response) => {
        if(response.status === 204) {
          let newModerators = moderators.filter(({_id})=> (_id !== moderatorId));
          setModerators(newModerators);
        }
      })
    }
  }
  const handleDeleteBan = (banId) => {
    if(id) {
      Axios.delete(`${config.server_url}/api/bans/`+banId)
      .then((response) => {
        if(response.status === 204) {
          let newBans = bans.filter(({_id}) => (_id !== banId));
          setBans(newBans);
        }
      })
    }
  }
  useEffect(() => {
    if(room) {
      const {name} = room;
      Axios.get(`${config.server_url}/api/rooms/`+name)
      .then((response) => {
        if(response.status === 200) {
          const {data : { data}} = response;
          console.log(data)
          const {_id, name, category, description, welcomeMessage, maxUsers, owner, bans, moderators, cover, icon} = data;
          setId(_id);
          setName(name);
          setCategory(category);
          setDescription(description);
          setWelcomeMessage(welcomeMessage);
          setMaxUsers(maxUsers);
          setOwner(owner);
          setBans(bans);
          setModerators(moderators);
          setCover(cover);
          setIcon(icon);
        }
      })
    }
  } , [room])

  return (
    <GridContainer>
      <GridItem xs={12} sm={8} md={8}>
        <Card>
          <CardHeader color="warning" icon>
            <CardIcon color="rose">
              <ChatIcon />
            </CardIcon>
            <p className={classes.cardCategory} style={{paddingTop:'20px',}}>
            <span style={{color:'#3c4858', fontSize:'20px',}}>View Room - </span>
            <span style={{paddingTop:'16px',}}>Update room info</span>
            </p>
          </CardHeader>
          <CardFooter style={{display: 'block'}}>
            <Grid container spacing={2} style={{marginTop:'20px'}}>
              <Grid item sm={1}>
              </Grid>
              <Grid item sm={2} style={{textAlign: 'right'}}>
                <p className={classes.cardCategory}>Room Name</p>
              </Grid>
              <Grid item sm={9}>
                <TextField style={{width: '100%'}} value={name}/>
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{marginTop:'20px'}}>
              <Grid item sm={1}>
              </Grid>
              <Grid item sm={2} style={{textAlign: 'right'}}>
                <p className={classes.cardCategory}>Category</p>
              </Grid>
              <Grid item sm={9}>
                <FormControl style={{width: '100%'}}>
                  <Select
                    native
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    label="category"
                    inputProps={{
                      name: 'category',
                      id: 'category',
                    }}
                  >
                    <option value="Comedy">Comedy</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Social">Social</option>
                    <option value="Technology">Technology</option>
                    <option value="Teen">Teen</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{marginTop:'20px'}}>
              <Grid item sm={1}>
              </Grid>
              <Grid item sm={2} style={{textAlign: 'right'}}>
                <p className={classes.cardCategory}>Description</p>
              </Grid>
              <Grid item sm={9}>
                <TextField style={{width: '100%'}}
                  value={description}
                  onChange={(e) => {setDescription(e.target.value)}}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{marginTop:'20px'}}>
              <Grid item sm={3} style={{textAlign: 'right'}}>
                <p className={classes.cardCategory}>Welcome message</p>
              </Grid>
              <Grid item sm={9}>
                <TextField style={{width: '100%'}}
                  value={welcomeMessage}
                  onChange={(e) => {setWelcomeMessage(e.target.value)}}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{marginTop:'20px'}}>
              <Grid item sm={1}>
              </Grid>
              <Grid item sm={2} style={{textAlign: 'right'}}>
                <p className={classes.cardCategory}>Max Users</p>
              </Grid>
              <Grid item sm={9}>
                <FormControl style={{width: '100%'}}>
                  <Select
                    native
                    value={maxUsers}
                    onChange={(e) => setMaxUsers(e.target.value)}
                    label="maxUsers"
                    inputProps={{
                      name: 'maxUsers',
                      id: 'maxUsers',
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                    <option value={9999}>Unlimited</option>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <div style={{display:'flex', justifyContent:'space-between', marginTop: '20px', marginBottom: '20px'}}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => {onClickBack()}}
              >
                Back
              </Button>
              <Button 
                variant="contained" 
                color="rose"
              >
                Update Room
              </Button>
            </div>
          </CardFooter>
        </Card>
        <GridContainer>
          <GridItem xs={12} sm={6} md={6}>
            <Card>
              <CardHeader color="warning" icon>
                <CardIcon color="primary">
                  <AssignmentIcon />
                </CardIcon>
                <p className={classes.cardCategory} style={{color:'#3c4858', fontSize:'40px', paddingTop:'16px',}}>Moderators</p>
              </CardHeader>
              <CardFooter style={{display: 'block'}}>

                <TableContainer>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>No</TableCell>
                        <TableCell>Username</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {moderators.map((row, index) => (
                        <TableRow hover role="checkbox" key={index}>
                          <TableCell component="th" scope="row">
                            {index+1}
                          </TableCell>
                          <TableCell >{row.username}</TableCell>
                          <TableCell align="right">
                            <IconButton style={{color:"#f44336"}} onClick={() => handleClickDeleteModerator(row._id)}>
                              <DeleteIcon  />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={6}>
            <Card>
              <CardHeader color="warning" icon>
                <CardIcon color="primary">
                  <AssignmentIcon />
                </CardIcon>
                <p className={classes.cardCategory} style={{color:'#3c4858', fontSize:'40px', paddingTop:'16px',}}>Banned Users</p>
              </CardHeader>
              <CardFooter style={{display: 'block'}}>
                <TableContainer>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>No</TableCell>
                        <TableCell>Username</TableCell>
                        <TableCell>IP</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bans.map((row, index) => (
                        <TableRow hover role="checkbox" key={index}>
                          <TableCell component="th" scope="row">
                            {index+1}
                          </TableCell>
                          <TableCell >{row.username}</TableCell>
                          <TableCell >{row.ip}</TableCell>
                          <TableCell align="right">
                            <IconButton style={{color:"#f44336"}} onClick={() => handleDeleteBan(row._id)}>
                              <DeleteIcon  />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </GridItem>
      <GridItem xs={12} sm={4} md={4}>
        <Card>
          <CardHeader style={{textAlign:'center'}}>
            <p className={classes.cardCategory}>OWNER</p>
            <p className={classes.cardCategory} style={{color:'#3c4858'}}>{owner ? owner.username: ''}</p>
          </CardHeader>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
