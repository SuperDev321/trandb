import React, { useContext } from 'react';
import propTypes from 'prop-types';
import { Route, Redirect, useLocation } from 'react-router-dom';
import {UserContext} from '../context';

const PrivateRoute = ({ children, path }) => {
  const { auth } = useContext(UserContext);
  const location = useLocation();
  return <Route path={path}>{auth ? children : <Redirect to={{pathname:"/login", state: {from: location}}}/>}</Route>;
};

PrivateRoute.propTypes = {
  children: propTypes.node.isRequired,
  path: propTypes.string.isRequired,
};

export default PrivateRoute;
