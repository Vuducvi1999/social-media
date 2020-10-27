import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link, NavLink, withRouter } from "react-router-dom";
import { GET_ALL_USER, GET_USER } from "../redux/actions/actionTypes";
import { getUsers } from "../user/apiUser";

const Menu = ({ jwt, dispatch, ...props }) => {
  useEffect(() => {
    getUsers()
      .then((data) => {
        dispatch({ type: GET_ALL_USER, payload: data });
      })
      .catch((e) => console.log(e));
    if (localStorage.getItem("jwt")) {
      console.log(JSON.parse(localStorage.getItem("jwt")));
      dispatch({
        type: GET_USER,
        payload: JSON.parse(localStorage.getItem("jwt")),
      });
    }
  }, [props.match]);

  return (
    <nav className="nav nav-tabs bg-primary justify-content-start mb-5">
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
  );
};

const mapStateToProps = (state) => ({ jwt: state.jwt });

export default connect(mapStateToProps, null)(withRouter(Menu));
