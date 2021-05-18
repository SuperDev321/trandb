import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import axios from "axios";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import UserContext from "./context/UserContext";
import { ToastProvider } from 'react-toast-notifications';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import "./style.css";

import Admin from "./Admin/layouts/Admin.js";
import config from './config'

export default function App() {
  const [auth, setAuth] = useState(null);
  const [superAdmin, setSuperAdmin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const removeUserData = () => {
    setSuperAdmin(false);
    setUserData(null);    
  }

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = window.localStorage.getItem('token');
      const { data } = await axios.post(`${config.server_url}/api/checkToken`, {
        token
      });
      console.log(data)
        if (data === 'un-auth') {
          setLoading(false);
          setSuperAdmin(false);
          setUserData(null);
        } else {
          if (data.role === 'admin'){
            setAuth(true);
            setSuperAdmin(false);
          }else if( data.role === 'super_admin') {
            setAuth(true);
            setSuperAdmin(true);
          } else {
            setAuth(false);
            setUserData(null);
            return;
          }
          let userData = {};

          if(data.username) userData.username = data.username;
          if(data.gender) userData.gender = data.gender;
          if(data.avatar) userData.avatar = data.avatar;
          setUserData(data);
          setLoading(false);
        }
      }
    //   let token = localStorage.getItem("auth-token");
    //   if (token === null) {
    //     localStorage.setItem("auth-token", "");
    //     token = "";
    //   }
    //   const tokenRes = await Axios.post(
    //     `${config.server_url}/users/tokenIsValid`,
    //     null,
    //     { headers: { "x-auth-token": token } }
    //   );
    //   if (tokenRes.data) {
    //     const userRes = await Axios.get("http://localhost:5000/users/", {
    //       headers: { "x-auth-token": token },
    //     });
    //     setUserData({
    //       token,
    //       user: userRes.data,
    //     });
    //   }
    // };

    checkLoggedIn();
  }, [auth]);


  return (
    <>
    {
      loading? null:
      <BrowserRouter>
        <UserContext.Provider value={{ auth, userData, setUserData, setAuth, superAdmin: superAdmin }}>
          <ToastProvider autoDismissTimeout={3000} autoDismiss={true}>
            <div className="container">
              <Switch>
                <PublicRoute path="/admin/login" component={Login} />
                {/* <Route path="/register" component={Register} /> */}
                <PrivateRoute path="/admin" component={Admin} />
                {/* <Redirect from="/admin" to="admin/dashboard" /> */}
              </Switch>
            </div>
          </ToastProvider>
        </UserContext.Provider>
      </BrowserRouter>
      }
    </>
  );
}
