import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { API_URL } from "../config";
import { followUser, getUser, unfollowUser } from "./apiUser";
import { deleteUser } from "../user/apiUser";
import { GET_USER } from "./../redux/actions/actionTypes";
import { Link } from "react-router-dom";

const Profile = ({ match, jwt, ...props }) => {
  // const [userFetch, setUserFetch] = useState();
  const [user, setUser] = useState({});
  const [isOne, setIsOne] = useState(false);
  const [follow, setFollow] = useState(undefined);

  useEffect(() => {
    getUser(match.params.userId)
      .then((data) => {
        if (data._id === jwt.user._id) {
          setIsOne(true);
          setUser(jwt.user);
        } else setUser(data);
      })
      .catch((e) => console.log(e));
  }, [match, jwt]);

  useEffect(() => {
    if (jwt.user._id && user._id) {
      // console.log("following:", jwt.user.following[0]);
      // console.log("curent user profile:", user._id);
      // console.log(
      //   "follow",
      //   jwt.user.following.find((p) => p === user._id) ? true : false
      // );
      setFollow(jwt.user.following.find((p) => p === user._id) ? true : false);
    }
  }, [jwt, user]);

  const deleteAcc = () => {
    const confirm = window.confirm("Do you want to delete account?");
    if (confirm) {
      deleteUser(user._id, jwt.token);
      props.dispatch({ type: GET_USER, payload: { token: "", user: {} } });
      localStorage.removeItem("jwt");
      props.history.push("/");
    }
  };
  const Follow = () => {
    followUser(jwt.user._id, user._id, jwt.token).then((data) => {
      console.log("following", [...jwt.user.following, user._id]);
      localStorage.setItem(
        "jwt",
        JSON.stringify({
          token: jwt.token,
          user: { ...jwt.user, following: [...jwt.user.following, user._id] },
        })
      );
      const following = [...jwt.user.following, user._id];
      props.dispatch({
        type: GET_USER,
        payload: {
          token: jwt.token,
          user: { ...jwt.user, following },
        },
      });
    });
  };
  const Unfollow = () => {
    unfollowUser(jwt.user._id, user._id, jwt.token).then((data) => {
      const unfollowing = jwt.user.following.filter((p) => p !== user._id);
      console.log("unfollowing", unfollowing);
      localStorage.setItem(
        "jwt",
        JSON.stringify({
          token: jwt.token,
          user: { ...jwt.user, following: unfollowing },
        })
      );
      props.dispatch({
        type: GET_USER,
        payload: {
          token: jwt.token,
          user: { ...jwt.user, following: unfollowing },
        },
      });
    });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 mb-3">
          <h2>Profile</h2>
        </div>
        <div className="col-4">
          <div className="avatar-profile">
            {user._id ? (
              <img
                className="img-thumbnail"
                src={`${API_URL}/user/photo/${user._id}`}
                alt=""
              />
            ) : (
              "Loading..."
            )}
          </div>
        </div>
        <div className="col-6">
          <p className="lead">Name: {user.name ? user.name : "Loading..."}</p>
          <p className="lead">
            Email: {user.email ? user.email : "Loading..."}
          </p>
          <p className="lead">
            Joined at: {new Date(user.createdAt).toLocaleString()}
          </p>
          <p className="lead">
            About:{" "}
            {user.about ? (
              user.about
            ) : (
              <span className="small font-italic font-weight-light  ">
                Not found user's about
              </span>
            )}
          </p>
          {isOne ? (
            <div className="d-flex justify-content-between">
              <button className="btn btn-raised btn-info">Create Post</button>

              {user._id && (
                <Link
                  className="btn btn-raised btn-success"
                  to={`/edit/${user._id}`}
                >
                  Edit Profile
                </Link>
              )}

              <button className="btn btn-raised btn-danger" onClick={deleteAcc}>
                Delete Profile
              </button>
            </div>
          ) : (
            jwt.user._id && (
              <div className="d-flex">
                {follow !== undefined ? (
                  follow ? (
                    <button
                      className="btn btn-raised btn-danger"
                      onClick={Unfollow}
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      className="btn btn-raised btn-primary"
                      onClick={Follow}
                    >
                      Follow
                    </button>
                  )
                ) : (
                  "waiting..."
                )}
              </div>
            )
          )}
        </div>
        <div className="col-12 mt-5">
          <hr className="m-0" />
          <ul className="nav nav-tabs nav-justified">
            <li className="nav-item">
              <a className="nav-link cursor">Post</a>
            </li>
            <li className="nav-item">
              <a className="nav-link cursor">Following</a>
            </li>
            <li className="nav-item">
              <a className="nav-link cursor ">Followers</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  jwt: state.jwt,
});

export default connect(mapStateToProps, null)(Profile);
