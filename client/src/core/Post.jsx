import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { API_URL } from "../config";
import { Link } from "react-router-dom";
import { CalcTime, uuid } from "../user/uuid";
import {
  commentPost,
  deletePost,
  likePost,
  uncommentPost,
  unlikePost,
} from "../post/apiPost";
import { getPosts } from "../post/apiPost";
import { GET_ALL_POST } from "../redux/actions/actionTypes";

const Post = ({ posts, match, ...props }) => {
  const [post, setPost] = useState({});
  const [requireSignin, setRequireSignin] = useState(false);
  const [signinToComment, setSigninToComment] = useState(false);
  const [text, setText] = useState("");
  const [showImg, setShowImg] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const id = match.params.postId;
    if (posts.length !== 0) {
      const currentPost = posts.find((p) => p._id === id);
      console.log(currentPost);
      setPost(currentPost);
    }
  }, [match.params, posts]);

  const Loading = () => (
    <div className="d-flex align-items-center loading h-100">
      <h4 className="text-center w-100">Loading...</h4>
    </div>
  );

  const imgPost = () => (
    <div className="container-title cursor">
      {post._id ? (
        <>
          <img
            src={`${API_URL}/post/photo/${post._id}`}
            alt={post.name}
            onClick={() => setShowImg(true)}
          />
        </>
      ) : (
        Loading()
      )}
    </div>
  );

  const showFullImage = () =>
    showImg && (
      <>
        <div className="contain-full-img">
          <div className="full-img" style={{ position: "relative" }}>
            <img
              src={`${API_URL}/post/photo/${post._id}`}
              alt={post.name}
            ></img>
            <i
              className="fa fa-close close-img cursor"
              onClick={() => setShowImg(false)}
            />
          </div>
          <div className="overlay" onClick={() => setShowImg(false)}></div>
        </div>
      </>
    );

  const Like = () => {
    if (props.jwt && !props.jwt.user._id) return setRequireSignin(true);
    if (!post.likes.find((p) => p === props.jwt.user._id))
      likePost(props.jwt.user._id, post._id, props.jwt.token)
        .then((data) => {
          setPost(data);
        })
        .catch((e) => console.log(e));
    else
      unlikePost(props.jwt.user._id, post._id, props.jwt.token)
        .then((data) => {
          // console.log(data);
          setPost(data);
        })
        .catch((e) => console.log(e));
  };

  const Uncomment = (text) => {
    uncommentPost(props.jwt.user._id, post._id, text, props.jwt.token)
      .then((data) => setPost(data))
      .catch((e) => console.log(e));
  };

  const Submit = (e) => {
    e.preventDefault();
    if (props.jwt && !props.jwt.user._id) return setSigninToComment(true);

    commentPost(props.jwt.user._id, post._id, text, props.jwt.token)
      .then((data) => {
        setText("");
        setPost(data);
      })
      .catch((e) => console.log(e));
  };

  const formComment = () => (
    <form onSubmit={Submit}>
      <div className="form-group mt-3">
        <textarea
          type="text"
          onChange={(e) => setText(e.target.value)}
          value={text}
          className="form-control"
          placeholder="Type here"
        />
      </div>
      <button type="submit" className="btn btn-primary btn-raised">
        Submit
      </button>
    </form>
  );

  const redirectSigninLike = () =>
    requireSignin && (
      <div className="alert alert-warning p-2 mt-2">
        You haven't
        <Link to="/signin"> signin</Link>
      </div>
    );

  const redirectSigninComment = () =>
    signinToComment && (
      <div className="alert alert-warning p-2 m-0">
        You haven't
        <Link to="/signin"> signin</Link>
      </div>
    );

  return (
    <div className="container">
      {showFullImage()}
      <div className="row">
        <div className="col-12">
          <h3
            className="display-3"
            style={{
              wordBreak: "break-word",
              lineHeight: 0.8,
              marginBottom: "1rem",
            }}
          >
            {post._id ? post.title : "Loading..."}
          </h3>
        </div>
        <div className="col-12">{imgPost()}</div>
        <div className="col-12">
          <div className="like-post my-3">
            <span className="like">
              {post._id && post.likes.length}{" "}
              <i
                onClick={Like}
                className="fa fa-thumbs-up cursor border-circle text-success bg-dark p-2"
              />
            </span>
            {redirectSigninLike()}
          </div>
        </div>
        <div className="col-12">
          <div className="container-body bg-white p-3 ">
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
            {post._id && props.jwt && props.jwt.user._id === post.postedBy._id && (
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
                      })
                      .catch((e) => console.log(e));
                    props.history.push("/");
                  }}
                >
                  Delete post
                </button>{" "}
              </>
            )}
          </div>
        </div>
        <div className="col-12">
          <h3 className="leave-comment">Leave a comment</h3>
          {redirectSigninComment()}
        </div>
        <div className="col-12">
          <div className="comment-post">{formComment()}</div>
        </div>
        <div className="col-12">
          <ul className="list-group bmd-list-group-sm">
            {post.comments &&
              post.comments.slice(0, 100).map((p) => (
                <div className="list-group-item comment" key={uuid()}>
                  <div className="bmd-list-group-col">
                    <p className="list-group-item-heading">{p.text}</p>
                    <div className="list-group-item-text">
                      Posted by{" "}
                      <Link to={`/profile/${p.user._id}`}>{p.user.name}</Link>{" "}
                      {CalcTime(p.createdAt)}
                      {props.jwt.user && props.jwt.user._id === p.user._id && (
                        <span
                          className="ml-3 cursor text-danger"
                          onClick={() => Uncomment(p.text)}
                        >
                          delete
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </ul>
        </div>
        <div className="col-12" style={{ marginBottom: "5rem" }}>
          {post.comments && post.comments.length > 100 && (
            <div className="alert alert-danger">Reach maximum 100 comments</div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  posts: state.posts,
  jwt: state.jwt,
});

export default connect(mapStateToProps, null)(Post);
