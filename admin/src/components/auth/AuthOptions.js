import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import {UserContext} from "../../context/UserContext";
import axios from 'axios';
import config from "config";
export default function AuthOptions() {
  const { userData, setUserData, setAuth } = useContext(UserContext);

  const history = useHistory();

  const register = () => history.push("/register");
  const login = () => history.push("/login");
  const logout = async () => {
    let res = await axios.get(config.server_url+'/api/logout');
    if(res.status === 200) {
      setUserData({
        avatar: undefined,
        username: undefined,
      });
      setAuth(false);
    }
  };

  return (
    <nav className="auth-options">
      {userData.user ? (
        <button onClick={logout}>Log out</button>
      ) : (
        <>
          <button onClick={register}>Register</button>
          <button onClick={login}>Log in</button>
        </>
      )}
    </nav>
  );
}
