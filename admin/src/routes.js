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
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import SpellcheckIcon from '@material-ui/icons/Spellcheck';
import BlockIcon from '@material-ui/icons/Block';
import SettingsIcon from '@material-ui/icons/Settings';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
// core components/views for Admin layout
import DashboardPage from "Admin/views/Dashboard/Dashboard.js";
import Rooms from "Admin/views/Room/Room.js";
import Ban from "Admin/views/Ban/Ban.js";
import Words from 'Admin/views/Forbidden';
import Setting from 'Admin/views/Setting';
import Quiz from 'Admin/views/Quiz';

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
    super: false,
  },
  {
    path: "/room",
    name: "Rooms",
    icon: MeetingRoomIcon,
    component: Rooms,
    layout: "/admin",
    super: false,
  },
  {
    path: "/ban",
    name: "BAN",
    icon: BlockIcon,
    component: Ban,
    layout: "/admin",
    super: false,
  },
  {
    path: "/fobidden words",
    name: "Forbidden words",
    icon: SpellcheckIcon,
    component: Words,
    layout: "/admin",
    super: false
  },
  {
    path: "/setting",
    name: "Setting",
    icon: SettingsIcon,
    component: Setting,
    layout: "/admin",
    super: true,
  },
  {
    path: "/quizes",
    name: "Quiz",
    icon: QuestionAnswerIcon,
    component: Quiz,
    layout: "/admin",
    super: true,
  },
];

export default dashboardRoutes;
