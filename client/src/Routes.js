import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";
import Home from "./core/Home";
import Menu from "./core/Menu";
import Post from "./core/Post";
import Users from "./core/Users";
import CreatePost from "./post/CreatePost";
import EditProfile from "./user/EditProfile";
import Profile from "./user/Profile";
import Signin from "./user/Signin";
import Signup from "./user/Signup";
import UpdatePost from "./post/UpdatePost";

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
          <PrivateRoute path="/post/create">
            <CreatePost />
          </PrivateRoute>
          <PrivateRoute path="/post/update/:postId">
            <UpdatePost />
          </PrivateRoute>
          <Route path="/post/:postId" component={Post} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default Routes;
