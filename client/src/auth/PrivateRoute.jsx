import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({ jwt, children, ...props }) => {
  const { user } = jwt;
  return (
    <Route
      {...props}
      render={() =>
        user._id ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: props.location.state ? props.location.state.prev : "/",
              state: { prev: props.location.pathname },
            }}
          />
        )
      }
    />
  );
};

const mapStateToProps = (state) => ({
  jwt: state.jwt,
});

export default connect(mapStateToProps, null)(PrivateRoute);
