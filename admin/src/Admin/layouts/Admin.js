import React, { useState, useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Navbar from "Admin/components/Navbars/Navbar.js";
import Sidebar from "Admin/components/Sidebar/Sidebar.js";
import routes from "routes.js";
import UserContext from '../../context/UserContext';
import styles from "Admin/assets/jss/material-dashboard-react/layouts/adminStyle.js";

import bgImage from "Admin/assets/img/sidebar-2.jpg";

let ps;

// const switchRoutes = (
//   <Switch>
//     {routes.map((prop, key) => {
//       if (prop.layout === "/admin" && (!prop.super || (prop.super && superAdmin))) {
//       //   console.log('ok')
//         return (
//           <Route
//             path={prop.layout + prop.path}
//             component={prop.component}
//             key={key}
//           />
//         );
//       }
//       return null;
//     })}
//     <Redirect from="/admin/" to="/admin/dashboard" />
//   </Switch>
// );

const useStyles = makeStyles(styles);

export default function Admin({ ...rest }) {
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  const {superAdmin} = useContext(UserContext);
  // states and functions
  // const [image, setImage] = React.useState(bgImage);
  // const [color, setColor] = React.useState("blue");
  // const [fixedClasses, setFixedClasses] = React.useState("dropdown show");
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [activeRoutes, setActiveRoutes] = useState([]);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getRoute = () => {
    return window.location.pathname !== "/admin/maps";
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };

  React.useEffect(() => {
    let activeRoutes = routes.filter((prop) => (!prop.super || (prop.super && superAdmin)));
    setActiveRoutes(activeRoutes);
  }, [])
  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={activeRoutes}
        logoText={"VS"}
        logoBody={"TRAND CHAT"}
        image={bgImage}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={'blue'}
        {...rest}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar
          routes={activeRoutes}
          superAdmin={superAdmin}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />
        {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
          <div className={classes.content}>
            <div className={classes.container}>
            <Switch>
              {activeRoutes.map((prop, key) => {
                if (prop.layout === "/admin") {
                //   console.log('ok')
                  return (
                    <Route
                      path={prop.layout + prop.path}
                      component={prop.component}
                      key={key}
                    />
                  );
                }
                return null;
              })}
              <Redirect from="/admin/" to="/admin/dashboard" />
            </Switch>
            </div>
          </div>
      </div>
    </div>
  );
}
