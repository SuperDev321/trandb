import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import axios from "axios";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import UserContext from "./context/UserContext";
import { ToastProvider } from 'react-toast-notifications';
import PrivateRoute from './components/PrivateRoute';
import "./style.css";

import Admin from "./Admin/layouts/Admin.js";
import config from './config'

export default function App() {
  const [auth, setAuth] = useState(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const { data } = await axios.get(`${config.server_url}/api/checkToken`);
        if (data === 'un-auth') {
          setLoading(false);
        } else {
          if (data.role === 'admin') setAuth(true);
          if(data.username) setUsername(data.username);
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
  }, []);


  return (
    <>
    {
      loading? null:
      <BrowserRouter>
        <UserContext.Provider value={{ auth, username }}>
          <ToastProvider autoDismissTimeout={3000} autoDismiss={true}>
            <div className="container">
              <Switch>
                <Route path="/admin/login" component={Login} />
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
