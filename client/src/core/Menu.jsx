import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, NavLink, useLocation, withRouter } from "react-router-dom";
import {
  GET_ALL_POST,
  GET_ALL_USER,
  GET_USER,
} from "../redux/actions/actionTypes";
import { getUsers } from "../user/apiUser";
import { getPosts } from "./../post/apiPost";

const Menu = ({ jwt, dispatch, ...props }) => {
  const [clickBar, setClickBar] = useState(false);

  useEffect(() => {
    // get users redux
    getUsers()
      .then((data) => {
        dispatch({ type: GET_ALL_USER, payload: data });
      })
      .catch((e) => console.log(e));

    // get posts redux
    getPosts()
      .then((data) => {
        dispatch({ type: GET_ALL_POST, payload: data });
      })
      .catch((e) => console.log(e));

    if (localStorage.getItem("jwt")) {
      dispatch({
        type: GET_USER,
        payload: JSON.parse(localStorage.getItem("jwt")),
      });
    }
  }, [props.match]);

  return (
    <>
      <nav className="nav nav-tabs bg-primary justify-content-start mb-5 pos-stick nav-pc">
        <NavLink exact={true} className="nav-link p-3" to="/">
          Home
        </NavLink>
        <NavLink className="nav-link p-3" to="/users">
          users
        </NavLink>
        {!jwt.user._id ? (
          <>
            <NavLink className="nav-link p-3" to="/signup">
              Sign up
            </NavLink>
            <NavLink className="nav-link p-3" to="/signin">
              Sign in
            </NavLink>
          </>
        ) : (
          ""
        )}
        {jwt.user._id && (
          <>
            <NavLink to={`/post/create`} className="nav-link p-3">
              Create Post
            </NavLink>
            <NavLink to={`/profile/${jwt.user._id}`} className="nav-link p-3">
              Profile
            </NavLink>
            <Link
              to="/"
              onClick={() => {
                localStorage.removeItem("jwt");
                dispatch({ type: GET_USER, payload: { jwt: "", user: {} } });
              }}
              className="nav-link p-3 cursor"
            >
              Sign out
            </Link>
          </>
        )}
      </nav>
      <nav className="nav nav-tabs bg-primary justify-content-start flex-column mb-5 pos-stick nav-mobile">
        <li
          className="fa fa-bars nav-link cursor ml-auto p-2"
          onClick={() => setClickBar(!clickBar)}
        ></li>

        {clickBar && (
          <nav className="nav d-inline nav-tabs bg-primary">
            <NavLink exact={true} className="nav-link p-3" to="/">
              Home
            </NavLink>
            <NavLink className="nav-link p-3" to="/users">
              users
            </NavLink>
            {!jwt.user._id ? (
              <>
                <NavLink className="nav-link p-3" to="/signup">
                  Sign up
                </NavLink>
                <NavLink className="nav-link p-3" to="/signin">
                  Sign in
                </NavLink>
              </>
            ) : (
              ""
            )}
            {jwt.user._id && (
              <>
                <NavLink to={`/post/create`} className="nav-link p-3">
                  Create Post
                </NavLink>
                <NavLink
                  to={`/profile/${jwt.user._id}`}
                  className="nav-link p-3"
                >
                  Profile
                </NavLink>
                <Link
                  to="/"
                  onClick={() => {
                    localStorage.removeItem("jwt");
                    dispatch({
                      type: GET_USER,
                      payload: { jwt: "", user: {} },
                    });
                  }}
                  className="nav-link p-3 cursor"
                >
                  Sign out
                </Link>
              </>
            )}
          </nav>
        )}
      </nav>
    </>
  );
};

const mapStateToProps = (state) => ({ jwt: state.jwt });

export default connect(mapStateToProps, null)(withRouter(Menu));
