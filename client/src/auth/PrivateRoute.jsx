import React from "react";
import { Redirect, Route } from "react-router-dom";
import { Auth } from "./index";

const PrivateRoute = ({ children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        Auth() ? (
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

// const mapStateToProps = (state) => ({
//   jwt: state.jwt,
// });

export default PrivateRoute;
