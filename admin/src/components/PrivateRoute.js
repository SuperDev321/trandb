import React, { useContext } from 'react';
import propTypes from 'prop-types';
import { Route, Redirect, useLocation } from 'react-router-dom';
import UserContext from '../context/UserContext';

const PrivateRoute = ({ component, path }) => {
  const { auth } = useContext(UserContext);
  const location = useLocation();
  return <Route path={path} component={auth && component}>{
    !auth &&
    <Redirect to={{pathname:"/login", state: {from: location}}}/>}</Route>;
};

PrivateRoute.propTypes = {
  children: propTypes.node.isRequired,
  path: propTypes.string.isRequired,
};

export default PrivateRoute;
