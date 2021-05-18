import React, {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import {
  Paper,
  TextField,
  Button,
  Grid,
  InputLabel,
  FormControl,
  Select,
  Container,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  IconButton
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import useStyles from './styles'
import { getRoomDetail, deleteBan, addModerator, deleteModerator, updateRoomGeneral, updateRoomMedia } from "../../utils";
import { Loading } from "../../pages";
import { useSnackbar } from 'notistack';
import ImageUploader from 'react-images-upload';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
          children
      )}
    </div>
  );
}

export default function RoomSetting() {
  const { room } = useParams();
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [roomId, setRoomId] = useState(null);
  const [roomName, setRoomName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [userNum, setUserNum] = useState('');
  const [password, setPassword] = useState('');
  const [moderators, setModerators] = useState('');
  const [owner, setOwner] = useState(null);
  const [cover, setCover] = useState(null);
  const [icon, setIcon] = useState(null);
  const [bans, setBans] = useState([]);

  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);


  const [moderator, setModerator] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleGeneralSubmit = () => {
    updateRoomGeneral({_id: roomId, category, description, welcomeMessage: message, maxUsers: userNum, password},
    () => {
      enqueueSnackbar('Successfully updated', {variant: 'success'});
      setPassword('');
    }, (err) => {
      enqueueSnackbar(err, {variant: 'error'});
      setPassword('');
    })
  }
  const handleMediaSubmit = () => {
    updateRoomMedia({_id: roomId, cover, icon},
    () => {
      enqueueSnackbar('Successfully updated', {variant: 'success'});
    }, (err) => {
      enqueueSnackbar(err, {variant: 'error'});
    })
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleDeleteBan = (_id) => {
    deleteBan(_id, (result) => {
      if(result) {
        enqueueSnackbar('Successfully deleted', {variant: 'success'});
        let newBans = bans.filter((ban) => (ban._id !== _id));
        setBans(newBans);
      }
    }, (err) => {
      enqueueSnackbar('Can not delete this ban', {variant: 'error'});
      console.log(err)
    })
  }
  const addNewModerator = () => {
    if(moderator && moderator !== '') {
      addModerator(roomId, moderator, ({_id, username}) => {
        setModerators([...moderators, {_id, username}]);
        setModerator('');
        enqueueSnackbar('Successfully added', {variant: 'success'});
      }, (err) => {
        enqueueSnackbar(err, {variant: 'error'});
        setModerator('');
      })
    }
  }
  const handleDeleteModerator = (_id) => {
    deleteModerator(roomId, _id, (result) => {
      if(result) {
        enqueueSnackbar('Successfully deleted', {variant: 'success'});
        let newModerators = moderators.filter((item) => (item._id !== _id));
        setModerators(newModerators);
      }
    }, (err) => {
      enqueueSnackbar('Can not delete this moderator', {variant: 'error'});
      console.log(err)
    })
  }
  const handleChangeCover = (picture) => {
    setCover(picture[0]);
  }
  const handleChangeIcon = (picture) => {
    setIcon(picture[0]);
  }
  useEffect(() => {
    if(room)
      getRoomDetail(room, (data) => {
        const {_id, name, category, description, welcomeMessage, maxUsers, owner, bans, moderators} = data;
        setRoomId(_id);
        setRoomName(name);
        setCategory(category);
        setDescription(description);
        setMessage(welcomeMessage);
        setUserNum(maxUsers);
        setOwner(owner);
        setBans(bans);
        setModerators(moderators);
        setTimeout(() => {
          setLoading(false); 
        }, 1000)
        
      }, (error) => {
        enqueueSnackbar('Can not access this setting.', {variant: 'error'});
      })
  }, [enqueueSnackbar, room]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  if(loading) {
    return <Loading />
  } else
  return (
    
    <Container className={classes.root}>
     
    
      <Grid container spacing={4} style={{marginTop: '12px'}}>
        <Grid item xs={12} sm={3}>
          <Paper elevation={3} className={classes.avatar}>
            <img className={classes.roundedCircle} width="100px" src="/img/default_avatar.png" alt="Card img cap" />
            <p className={classes.avatarName}>{(owner && owner.username) ? owner.username: 'Username'}</p>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={9}>
          <h2>Room - {roomName}</h2>
          <Paper elevation={3} className={classes.general}>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="General" />
              <Tab label="Media" />
              <Tab label="Moderators" />
              <Tab label="Baned Users" />
            </Tabs>
            <hr className={classes.headLine} style={{marginTop:'10px', }} />
            <TabPanel value={tab} index={0}>
              <form className={classes.form} noValidate autoComplete="off">
              <FormControl fullWidth variant="outlined" className={classes.formControl} style={{marginTop: '30px'}}>
                <InputLabel htmlFor="category">Category</InputLabel>
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
              <TextField fullWidth
                id="outlined-description" 
                label="Description" 
                variant="outlined" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{marginTop: '30px'}} 
              />
              <TextField fullWidth
                id="outlined-multiline-static"
                label="Welcome Message"
                rows={2}
                defaultValue={message}
                onChange={(e) => setMessage(e.target.value)}
                variant="outlined"
                style={{marginTop: '30px'}}
              />
              <FormControl fullWidth variant="outlined" className={classes.formControl} style={{marginTop: '30px'}}>
                <InputLabel htmlFor="userNum">Max users</InputLabel>
                <Select
                  native
                  value={userNum}
                  onChange={(e) => setUserNum(e.target.value)}
                  label="userNum"
                  inputProps={{
                    name: 'userNum',
                    id: 'userNum',
                  }}
                >
                  <option value="9999">- Unlimited -</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                </Select>
              </FormControl>
              <TextField fullWidth
                id="outlined-password" 
                label="Password" 
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                style={{marginTop: '40px', marginBottom: '25px'}} 
              />
              <div >
                <Button variant="contained" color="primary" onClick={handleGeneralSubmit}>
                  Save Changes
                </Button>
              </div>
              </form>
            </TabPanel>
            <TabPanel value={tab} index={1}>
              {/* <div>
                <img className={classes.mediaImage} width="100px" src="/img/default_avatar.png" alt="Card img cap" />
                <p>Upload a room icon</p>
              </div> */}
              <div className={classes.fileupload}>
              <ImageUploader
                withLabel={true}
                withPreview={true}
                singleImage={true}
                withIcon={false}
                buttonText='Choose cover image'
                onChange={handleChangeCover}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
              />
              <ImageUploader
                withLabel={true}
                withPreview={true}
                singleImage={true}
                withIcon={false}
                buttonText='Choose icon image'
                onChange={handleChangeIcon}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
              />
                {/* <TextField
                  fullWidth
                  name="upload-photo"
                  type="file"
                />
                <p style={{marginTop:'5px'}}>
                  This icon will display on your chat room page and chat sidebar. <strong>160x160 is the recommended size for this image.</strong>
                </p>
              </div>
              <p style={{marginTop:'8px'}}>Upload a room icon</p>
              <div className={classes.fileupload}>
                <TextField
                  fullWidth
                  name="upload-photo"
                  type="file"
                />
                <p style={{marginTop:'5px'}}>
                  This image will show up at the top of your chat room page. <strong>800x200 is the recommended size for this image.</strong>
                </p>
              </div>
              <div > */}
                <Button variant="contained" color="primary" onClick={handleMediaSubmit}>
                  Save Changes
                </Button>
              </div>
            </TabPanel>
            <TabPanel value={tab} index={2}>
              <div style={{display:'flex', width: '100%', alignItems: 'center', paddingTop: 15, paddingBottom: 15}}>
                <div style={{width: 300}}>
                  <TextField 
                    fullWidth
                    id="outlined-moderator" 
                    label="Add Moderator"
                    variant="outlined"
                    value={moderator}
                    onChange={(e) => {setModerator(e.target.value)}}
                  />
                </div>
                <div style={{flexGrow: 1}}></div>
                <div>
                  <Button variant="contained" color="primary" size="large" onClick={() => {addNewModerator()}}>
                    <AddCircleIcon />
                    &nbsp; Add
                  </Button>
                </div>
              </div>
              { (moderators && moderators.length)?
              <>
              <TableContainer style={{marginTop: '25px'}}>
              <Table className={classes.table} size="small" aria-label="a ban table">
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell >Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {moderators.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow key={row._id}>
                      <TableCell>{row.username}</TableCell>
                      <TableCell>
                        <IconButton color="primary" aria-label="delete" onClick={() => {handleDeleteModerator(row._id)}}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={bans.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
              </>
              :
              (null)
              }
            </TabPanel>
            <TabPanel value={tab} index={3}>
              { (bans && bans.length)?
              <>
              <TableContainer style={{marginTop: '25px'}}>
              <Table className={classes.table} size="small" aria-label="a ban table">
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell >Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow key={row._id}>
                      <TableCell>{row.username}</TableCell>
                      <TableCell>
                        <IconButton color="primary" aria-label="delete" onClick={() => {handleDeleteBan(row._id)}}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={bans.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
              </>
              :
              (null)
              }
            </TabPanel>
            
            
          </Paper>
        </Grid>
        
      </Grid>
    
    </Container>
  );
}
