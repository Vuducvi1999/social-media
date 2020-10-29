import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { API_URL } from "../config";
import { followUser, getUser, getUserPosts, unfollowUser } from "./apiUser";
import { deleteUser } from "../user/apiUser";
import { GET_USER } from "./../redux/actions/actionTypes";
import { Link } from "react-router-dom";
import { CalcTime, uuid } from "./uuid";

const Profile = ({ match, jwt, ...props }) => {
  // const [userFetch, setUserFetch] = useState();
  const [user, setUser] = useState({});
  const [isOne, setIsOne] = useState(false);
  const [follow, setFollow] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => window.scrollTo(0, 0), []);

  useEffect(() => {
    // get user hiện tại thông qua match.params
    getUser(match.params.userId)
      .then((data) => {
        if (data.error) return setError(data.error);
        if (data._id == jwt.user._id) {
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
          if (jwt.user.following)
            setFollow(
              jwt.user.following.find((p) => p._id === data._id) ? true : false
            );
          else setFollow(false);
        }
      })
      .catch((e) => console.log(e));

    // get listPost
    getUserPosts(match.params.userId)
      .then((data) => {
        if (!data.error) setUserPosts(data);
      })
      .catch((e) => console.log(e));
  }, [match, jwt]);

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

  const Avatar = () => (
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
  );
  const Info = () => (
    <div className="col-md-8 col-12">
      <div className="profile-info">
        Name:{" "}
        {user.name ? (
          <span className="name-profile">{user.name}</span>
        ) : (
          "Loading..."
        )}
      </div>
      <div className="profile-info">
        Email:{" "}
        {user.email ? (
          <span className="email-profile">{user.email}</span>
        ) : (
          "Loading..."
        )}
      </div>
      <div className="profile-info">
        Joined at:{" "}
        <span className="joined-profile">
          {new Date(user.createdAt).toLocaleString()}
        </span>
      </div>
      <div className="profile-info">
        About:{" "}
        {user.about ? (
          <div className="span about-profile">{user.about}</div>
        ) : (
          <span className="not-found  ">Not found user's about</span>
        )}
      </div>
      {isOne ? (
        <div className="d-flex justify-content-between button-container">
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
  );
  const Action = () => (
    <div className="col-12 mt-5">
      <hr className="m-0" />
      <ul className="row nav nav-tabs nav-justified">
        <div className="col-12 col-md-4 ">
          <li className="nav-item ">
            <a className="nav-link cursor info-title-user">
              Post &nbsp;
              <span className="text-dark">
                ({userPosts && userPosts.length})
              </span>
            </a>
            <ul className="list-group box-navigator">
              {userPosts.length > 0 &&
                userPosts.slice(0, 51).map((p) => (
                  <li key={uuid()} className=" d-flex align-items-center">
                    <div className="contain-litle-avatar contain-litle-post">
                      <Link
                        to={`/post/${p._id}`}
                        className="content-litle-avatar container-little-post"
                        style={{
                          backgroundImage: `url(${API_URL}/post/photo/${p._id})`,
                        }}
                      />
                    </div>
                    <span className="name-after-avatar name-after-post">
                      <Link to={`/post/${p._id}`}>{p.title}</Link>
                      <div className="created-post text-muted">
                        Created {CalcTime(p.createdAt)}
                      </div>
                    </span>
                  </li>
                ))}
              {userPosts && userPosts.length > 50 && (
                <div className="alert alert-warning">
                  Reach maximum 50 items
                </div>
              )}
            </ul>
          </li>
        </div>
        <div className="col-12 col-md-4 ">
          <li className="nav-item ">
            <a className="nav-link cursor info-title-user ">
              Following &nbsp;
              <span className="text-dark">
                ({user.following && user.following.length})
              </span>
            </a>
            <ul className="list-group box-navigator">
              {user.following &&
                user.following.slice(0, 51).map((p) => (
                  <li key={uuid()} className=" d-flex align-items-center">
                    <div className="contain-litle-avatar">
                      <Link
                        to={`/profile/${p._id}`}
                        className="content-litle-avatar"
                        style={{
                          backgroundImage: `url(${API_URL}/user/photo/${p._id})`,
                        }}
                      />
                    </div>
                    <span className="name-after-avatar">
                      <Link to={`/profile/${p._id}`}>{p.name}</Link>
                    </span>
                  </li>
                ))}
              {user.following && user.following.length > 50 && (
                <div className="alert alert-warning">
                  Reach maximum 50 items
                </div>
              )}
            </ul>
          </li>
        </div>
        <div className="col-12 col-md-4 ">
          <li className="nav-item ">
            <a className="nav-link cursor info-title-user ">
              Followers &nbsp;
              <span className="text-dark">
                ({user.followers && user.followers.length})
              </span>
            </a>
            {/* <div className="box-navigator"></div> */}
            <ul className="list-group box-navigator">
              {user.followers &&
                user.followers.slice(0, 51).map((p) => (
                  <li key={uuid()} className=" d-flex align-items-center">
                    <div className="contain-litle-avatar">
                      <Link
                        to={`/profile/${p._id}`}
                        className="content-litle-avatar"
                        style={{
                          backgroundImage: `url(${API_URL}/user/photo/${p._id})`,
                        }}
                      />
                    </div>
                    <span className="name-after-avatar">
                      <Link to={`/profile/${p._id}`}>{p.name}</Link>
                    </span>
                  </li>
                ))}
              {user.followers && user.followers.length > 50 && (
                <div className="alert alert-warning">
                  Reach maximum 50 items
                </div>
              )}
            </ul>
          </li>
        </div>
      </ul>
    </div>
  );

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 mb-3">
          <h2>Profile</h2>
        </div>
        {error ? (
          <div className="col-12">
            <div className="alert alert-danger">{error}</div>
          </div>
        ) : (
          <>
            {Avatar()}
            {Info()}
            {Action()}
          </>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  jwt: state.jwt,
});

export default connect(mapStateToProps, null)(Profile);
