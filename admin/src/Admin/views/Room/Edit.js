import React from "react";
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

const useStyles = makeStyles(styles);

function createData(no, username) {
  return { no, username};
}

const rows = [
  createData('Frozen yoghurt', 159),
  createData('Ice cream', 237),
  createData('Eclair', 262),
  createData('Cupcake', 305),
  createData('Gingerbread', 356),
];

export default function Edit( {onClickBack} ) {
  const classes = useStyles();
  const [category, setCategory] = React.useState('Comedy');
  const [maxUsers, setMaxUsers] = React.useState('unlimited');

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
                <TextField style={{width: '100%'}}/>
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
                <TextField style={{width: '100%'}}/>
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{marginTop:'20px'}}>
              <Grid item sm={3} style={{textAlign: 'right'}}>
                <p className={classes.cardCategory}>Welcome message</p>
              </Grid>
              <Grid item sm={9}>
                <TextField style={{width: '100%'}}/>
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
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="unlimited">unlimited</option>
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
                      {rows.map((row) => (
                        <TableRow hover role="checkbox" key={row.no}>
                          <TableCell component="th" scope="row">
                            {row.no}
                          </TableCell>
                          <TableCell align="right">{row.username}</TableCell>
                          <TableCell>
                            <IconButton style={{color:"#f44336"}}>
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
                <p className={classes.cardCategory} style={{color:'#3c4858', fontSize:'40px', paddingTop:'16px',}}>Banned</p>
                <p className={classes.cardCategory} style={{color:'#3c4858', fontSize:'40px'}}>Users</p>
              </CardHeader>
              <CardFooter style={{display: 'block'}}>
                <Grid container spacing={2} style={{marginTop:'20px'}}>
                  <Grid item sm={1}>
                  </Grid>
                  <Grid item sm={2} style={{textAlign: 'right'}}>
                    <p className={classes.cardCategory}>Nickname</p>
                  </Grid>
                  <Grid item sm={9}>
                    <TextField style={{width: '100%'}}/>
                  </Grid>
                </Grid>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </GridItem>
      <GridItem xs={12} sm={4} md={4}>
        <Card>
          <CardHeader style={{textAlign:'center'}}>
            <p className={classes.cardCategory}>OWNER</p>
            <p className={classes.cardCategory} style={{color:'#3c4858'}}>Chun Sim</p>
          </CardHeader>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
