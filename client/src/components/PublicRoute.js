import React from 'react';
import propTypes from 'prop-types';
import { Route } from 'react-router-dom';

const PublicRoute = ({ children, path }) => {
  // const { auth } = useContext(UserContext);
  return (
    <Route path={path}>{children}</Route>
  );
};

PublicRoute.propTypes = {
  children: propTypes.node.isRequired,
  path: propTypes.string.isRequired,
};

export default PublicRoute;
