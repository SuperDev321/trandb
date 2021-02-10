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

import styles from "Admin/assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

function IpComponent() {
  const classes = useStyles();

  return(
    <Grid container spacing={2} style={{marginTop:'20px'}}>
      <Grid item sm={1}>
      </Grid>
      <Grid item sm={2} style={{textAlign: 'right'}}>
        <p className={classes.cardCategory}>Ip</p>
      </Grid>
      <Grid item sm={9}>
        <FormattedInputs />
      </Grid>
    </Grid>
  );
}

function RangeComponent() {
  const classes = useStyles();

  return(
    <Grid container spacing={2} style={{marginTop:'20px'}}>
      <Grid item sm={1}>
      </Grid>
      <Grid item sm={2} style={{textAlign: 'right'}}>
        <p className={classes.cardCategory}>Range</p>
      </Grid>
      <Grid item sm={9}>
        <FormattedInputs textLabel="From" />
        <FormattedInputs textLabel="To" />
      </Grid>
    </Grid>
  );
}

export default function Edit( {onClickBack} ) {
  const classes = useStyles();
  const [bantype, setBantype] = React.useState('ip');

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
                <TextField style={{width: '100%'}}/>
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
            {bantype === 'ip'? <IpComponent /> : null}
            {bantype === 'range'? <RangeComponent /> : null}
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
                Create
              </Button>
            </div>
          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
