import React, { useContext } from "react";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import axios from 'axios';
// core components
import Button from "Admin/components/CustomButtons/Button.js";

import styles from "Admin/assets/jss/material-dashboard-react/components/headerLinksStyle.js";
import UserContext from "context/UserContext";
import config from "config";

const useStyles = makeStyles(styles);

export default function AdminNavbarLinks() {
  const classes = useStyles();
  const [openProfile, setOpenProfile] = React.useState(null);
  const { userData, setUserData, setAuth  }= useContext(UserContext); 
  // const handleClickNotification = event => {
  //   if (openNotification && openNotification.contains(event.target)) {
  //     setOpenNotification(null);
  //   } else {
  //     setOpenNotification(event.currentTarget);
  //   }
  // };
  // const handleCloseNotification = () => {
  //   setOpenNotification(null);
  // };
  const handleClickProfile = event => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  const handleCloseProfile = () => {
    setOpenProfile(null);
  };
  const logout = async () => {
    await axios.get(config.server_url+'/api/logout');
    setUserData({
      avatar: undefined,
      username: undefined,
    });
    setAuth(false);
    
  };
  return (
    <div>
      <div className={classes.manager}>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openProfile ? "profile-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={classes.buttonLink}
        >
          <img className={classes.icons} src={(userData && userData.avatar)? config.main_site_url+userData.avatar:"/img/default_avatar.png"} alt="Avatar img" />
          <p style={{textTransform: 'initial'}}>&nbsp;{(userData && userData.username)? userData.username: ''} </p>
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Profile</p>
          </Hidden>
        </Button>
        <Poppers
          style={{marginTop: '6px'}}
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !openProfile }) +
            " " +
            classes.popperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseProfile}>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={logout}
                      className={classes.dropdownItem}
                    >
                      Logout
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>
    </div>
  );
}
