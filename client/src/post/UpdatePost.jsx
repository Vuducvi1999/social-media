import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { updatePost } from "./apiPost";

const UpdatePost = ({ jwt, ...props }) => {
  const initvalue = {
    title: "",
    body: "",
    photo: "",
    error: "",
    success: false,
    formData: "",
    loading: false,
  };
  const [values, setValue] = useState(initvalue);
  const [formData, setformData] = useState(new FormData());
  const { title, body, success, error, loading } = values;

  useEffect(() => {
    window.scrollTo(0, 0);
    const currentPost = props.posts.find(
      (p) => p._id === props.match.params.postId
    );
    setValue({ ...values, ...currentPost });
    for (let i in currentPost) {
      formData.set(i, currentPost[i]);
    }
  }, [jwt, props.posts]);

  const Change = (e) => {
    const name = e.target.name;
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    setValue({ ...values, [name]: value });
  };

  const Submit = (e) => {
    e.preventDefault();
    formData.set("postedBy", jwt.user._id);
    setValue({ ...values, loading: true });
    updatePost(formData, props.match.params.postId, jwt.token)
      .then((data) => {
        console.log(data);
        if (data.error)
          return setValue({ ...values, loading: false, error: data.error });
        return setValue({ ...initvalue, success: true });
      })
      .catch((e) => console.log(e));
  };

  const Error = () => (
    <>{error && <div className="alert alert-danger">{error}</div>} </>
  );
  const Success = () => (
    <>{success && <div className="alert alert-success">Post updated</div>} </>
  );
  const Loading = () => (
    <>{loading ? <h2 className="lead bg-light p-5">Loading...</h2> : ""} </>
  );

  const form = () => (
    <>
      <form onSubmit={Submit}>
        <div className="form-group">
          <label htmlFor="" className="text-muted">
            Photo
          </label>
          <input
            type="file"
            name="photo"
            className="form-control-file"
            onChange={Change}
          />
        </div>
        <div className="form-group">
          <label htmlFor="" className="text-muted">
            Title
          </label>
          <input
            type="text"
            name="title"
            className="form-control"
            onChange={Change}
            value={title}
          />
        </div>
        <div className="form-group">
          <label htmlFor="" className="text-muted">
            Body
          </label>
          <textarea
            style={{ whiteSpace: "pre-line" }}
            name="body"
            className="form-control"
            onChange={Change}
            value={body}
          />
        </div>
        <button type="submit" className="btn btn-raised btn-primary">
          Submit
        </button>
      </form>
    </>
  );
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-5">Update Post</h2>
        </div>
        <div className="col-12">
          {Error()}
          {Success()}
          {Loading()}
          {form()}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  jwt: state.jwt,
  posts: state.posts,
});

export default connect(mapStateToProps, null)(withRouter(UpdatePost));
