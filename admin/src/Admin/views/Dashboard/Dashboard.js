import React, { useEffect } from "react";
// react plugin for creating charts
// import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import ReplyIcon from '@material-ui/icons/Reply';
import ChatIcon from '@material-ui/icons/Chat';
// core components
import GridItem from "Admin/components/Grid/GridItem.js";
import GridContainer from "Admin/components/Grid/GridContainer.js";
// import CustomTabs from "Admin/components/CustomTabs/CustomTabs.js";
import Danger from "Admin/components/Typography/Danger.js";
import Card from "Admin/components/Card/Card.js";
import CardHeader from "Admin/components/Card/CardHeader.js";
import CardIcon from "Admin/components/Card/CardIcon.js";
import CardFooter from "Admin/components/Card/CardFooter.js";
import { NavLink } from "react-router-dom";
import Axios from 'axios';
import config from '../../../config'
// import { bugs, website, server } from "Admin/variables/general.js";

import styles from "Admin/assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();
  const [num, setNum] = React.useState(0);

  useEffect(() => {
    const roomRead = async () => {
      const rooms = await Axios.get(`${config.server_url}/api/rooms`);
      if(Array.isArray(rooms.data.data)) {
        setNum(rooms.data.data.length);
      }
    }
    roomRead()
  }, []);
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <ChatIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Available Rooms</p>
              <h3 className={classes.cardTitle}>
                <small>{num}</small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Danger>
                  <ReplyIcon />
                </Danger>
                <NavLink to="/admin/room">
                  Rooms
                </NavLink>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
