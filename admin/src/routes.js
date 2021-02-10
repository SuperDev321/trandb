/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import AssistantIcon from '@material-ui/icons/Assistant';
import ChatIcon from '@material-ui/icons/Chat';
// core components/views for Admin layout
import DashboardPage from "Admin/views/Dashboard/Dashboard.js";
import Rooms from "Admin/views/Room/Room.js";
import Ban from "Admin/views/Ban/Ban.js";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
  {
    path: "/room",
    name: "Rooms",
    icon: ChatIcon,
    component: Rooms,
    layout: "/admin"
  },
  {
    path: "/ban",
    name: "BAN",
    icon: AssistantIcon,
    component: Ban,
    layout: "/admin"
  },
];

export default dashboardRoutes;
