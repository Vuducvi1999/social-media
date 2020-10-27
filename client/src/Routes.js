import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";
import Home from "./core/Home";
import Menu from "./core/Menu";
import Users from "./core/Users";
import EditProfile from "./user/EditProfile";
import Profile from "./user/Profile";
import Signin from "./user/Signin";
import Signup from "./user/Signup";

function Routes() {
  return (
    <BrowserRouter>
      <div>
        <Menu />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/profile/:userId" component={Profile} />
          <Route path="/signup" component={Signup} />
          <Route path="/signin" component={Signin} />
          <Route path="/users" component={Users} />
          <PrivateRoute path="/edit/:userId">
            <EditProfile />
          </PrivateRoute>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default Routes;
