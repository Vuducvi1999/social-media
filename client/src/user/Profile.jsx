import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { API_URL } from "../config";
import { followUser, getUser, unfollowUser } from "./apiUser";
import { deleteUser } from "../user/apiUser";
import { GET_USER } from "./../redux/actions/actionTypes";
import { Link } from "react-router-dom";
import { uuid } from "./uuid";

const Profile = ({ match, jwt, ...props }) => {
  // const [userFetch, setUserFetch] = useState();
  const [user, setUser] = useState({});
  const [isOne, setIsOne] = useState(false);
  const [follow, setFollow] = useState(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUser(match.params.userId)
      .then((data) => {
        if (data._id === jwt.user._id) {
          setIsOne(true);
          setUser(jwt.user);
          setFollow(
            jwt.user.following.find((p) => p._id === jwt.user._id)
              ? true
              : false
          );
        } else {
          setIsOne(false);
          setUser(data);
          setFollow(
            jwt.user.following.find((p) => p._id === data._id) ? true : false
          );
        }
      })
      .catch((e) => console.log(e));
  }, [match, jwt]);

  useEffect(() => {
    window.scrollTo(0, 0);
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
    setLoading(true);
    followUser(jwt.user._id, user._id, jwt.token).then((data) => {
      getUser(jwt.user._id).then((data) => {
        if (data.err) return;
        localStorage.setItem(
          "jwt",
          JSON.stringify({
            token: jwt.token,
            user: data,
          })
        );
        props.dispatch({
          type: GET_USER,
          payload: {
            token: jwt.token,
            user: data,
          },
        });
        setLoading(false);
      });
    });
  };
  const Unfollow = () => {
    setLoading(true);
    unfollowUser(jwt.user._id, user._id, jwt.token).then((data) => {
      getUser(jwt.user._id).then((data) => {
        if (data.err) return;
        localStorage.setItem(
          "jwt",
          JSON.stringify({
            token: jwt.token,
            user: data,
          })
        );
        props.dispatch({
          type: GET_USER,
          payload: {
            token: jwt.token,
            user: data,
          },
        });

        setLoading(false);
      });
    });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 mb-3">
          <h2>Profile</h2>
        </div>
        <div className="col-md-4 col-12">
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
        <div className="col-md-6 col-12">
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
              <span className="not-found  ">Not found user's about</span>
            )}
          </p>
          {isOne ? (
            <div className="d-flex justify-content-between">
              <Link className="btn btn-raised btn-info" to={`/post/create`}>
                Create Post
              </Link>

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
                    <>
                      <button
                        className="btn btn-raised btn-danger"
                        onClick={Unfollow}
                      >
                        {loading ? "..." : "UnFollow"}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-raised btn-primary"
                        onClick={Follow}
                      >
                        {loading ? "..." : "Follow"}
                      </button>
                    </>
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
          <ul className="row nav nav-tabs nav-justified">
            <div className="col-12 col-md-4 ">
              <li className="nav-item ">
                <a className="nav-link cursor info-title-user">Post</a>
                {/* <div className="box-navigator"></div> */}
                <ul class="list-group">
                  {/* <li class="list-group-item">Cras justo odio</li> */}
                </ul>
              </li>
            </div>
            <div className="col-12 col-md-4 ">
              <li className="nav-item ">
                <a className="nav-link cursor info-title-user ">Following</a>
                {/* <div className="box-navigator"></div> */}
                <ul class="list-group box-navigator">
                  {user.following &&
                    user.following.map((p) => (
                      <li key={uuid()} class=" d-flex align-items-center">
                        <Link
                          className="contain-litle-avatar"
                          to={`/profile/${p._id}`}
                        >
                          <div
                            className="content-litle-avatar"
                            style={{
                              display: "block",
                              borderRadius: "10%",
                              width: "80%",
                              height: "auto",
                              backgroundImage: `url(${API_URL}/user/photo/${p._id})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                        </Link>
                        <span className="name-after-avatar">
                          <Link to={`/profile/${p._id}`}>{p.name}</Link>
                        </span>
                      </li>
                    ))}
                </ul>
              </li>
            </div>
            <div className="col-12 col-md-4 ">
              <li className="nav-item ">
                <a className="nav-link cursor info-title-user ">Followers</a>
                {/* <div className="box-navigator"></div> */}
                <ul class="list-group box-navigator">
                  {user.followers &&
                    user.followers.map((p) => (
                      <li key={uuid()} class=" d-flex align-items-center">
                        <Link
                          className="contain-litle-avatar"
                          to={`/profile/${p._id}`}
                        >
                          <div
                            className="content-litle-avatar"
                            style={{
                              display: "block",
                              borderRadius: "10%",
                              width: "80%",
                              height: "auto",
                              backgroundImage: `url(${API_URL}/user/photo/${p._id})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                        </Link>
                        <p className="name-after-avatar">{p.name}</p>
                      </li>
                    ))}
                </ul>
              </li>
            </div>
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
