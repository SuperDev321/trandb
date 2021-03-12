import React, { useContext } from 'react';
import propTypes from 'prop-types';
import { Route, Redirect, useLocation } from 'react-router-dom';
import UserContext from '../context/UserContext';

const PublicRoute = ({ component, path }) => {
  const { auth } = useContext(UserContext);
  return <Route path={path} component={!auth && component}>{
    auth &&
    <Redirect to="/admin/dashboard"/>}</Route>;
};

// PrivateRoute.propTypes = {
//   children: propTypes.node.isRequired,
//   path: propTypes.string.isRequired,
// };

export default PublicRoute;
