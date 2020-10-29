import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { API_URL } from "../config";
import { Link, Redirect } from "react-router-dom";
import { CalcTime } from "../user/uuid";
import { deletePost } from "../post/apiPost";
import { getPosts } from "../post/apiPost";
import { GET_ALL_POST } from "../redux/actions/actionTypes";
import { set } from "mongoose";

const Post = ({ posts, match, ...props }) => {
  const [post, setPost] = useState({});
  const [deleted, setDeleted] = useState(false);
  useEffect(() => {
    const id = match.params.postId;
    if (posts.length !== 0) {
      const currentPost = posts.find((p) => p._id === id);
      setPost(currentPost);
    }
  }, [match.params, posts]);
  const Loading = () => (
    <h4 className="d-flex align-items-center loading h-100">
      <h3 className="text-center w-100">Loading...</h3>
    </h4>
  );

  const imgPost = () => (
    <div className="container-title">
      {post._id ? (
        <img src={`${API_URL}/post/photo/${post._id}`} alt="" />
      ) : (
        Loading()
      )}
    </div>
  );

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h3 className="display-3 mb-3">
            {post._id ? post.title : "Loading..."}
          </h3>
        </div>
        <div className="col-12">{imgPost()}</div>
        <div className="col-12">
          <div className="container-body bg-white p-3 mt-4">
            {post._id ? post.body : "Loading..."}
          </div>
        </div>
        <div className="col-12">
          {post._id && (
            <div className="container-postedBy mt-4">
              Posted by{" "}
              <Link to={`/profile/${post.postedBy._id}`}>
                {post.postedBy.name}
              </Link>{" "}
              on {CalcTime(post.createdAt)}
            </div>
          )}
        </div>
        <div className="col-12">
          <div className="mt-3 d-flex button-container-post justify-content-between">
            <Link to="/" className="btn btn-raised btn-primary">
              Back to posts
            </Link>
            {post._id && props.jwt.user._id === post.postedBy._id && (
              <>
                <Link
                  className="btn btn-raised btn-warning"
                  to={`/post/update/${post._id}`}
                >
                  Update post
                </Link>
                <button
                  className="btn btn-raised btn-danger"
                  onClick={() => {
                    const confirm = window.confirm("Delete this post?");
                    if (confirm) deletePost(post._id, props.jwt.token);
                    getPosts()
                      .then((data) => {
                        props.dispatch({ type: GET_ALL_POST, payload: data });
                        setDeleted(true);
                      })
                      .catch((e) => console.log(e));
                  }}
                >
                  Delete post
                </button>{" "}
              </>
            )}
          </div>
        </div>
        {deleted && <Redirect to="/" />}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  posts: state.posts,
  jwt: state.jwt,
});

export default connect(mapStateToProps, null)(Post);
