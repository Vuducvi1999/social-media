import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

const CreatePost = ({ jwt, ...props }) => {
  const initvalue = {
    title: "",
    body: "",
    photo: "",
    postedBy: "",
    error: "",
    success: false,
    formData: "",
    loading: false,
  };
  const [value, setValue] = useState(initvalue);
  const [formData, setformData] = useState(null);
  const { title, body, photo, postedBy, success, error, loading } = value;

  useEffect(() => {
    setformData(new FormData());
  }, [props.match]);

  const Change = (e) => {
    const name = e.target.name;
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    setValue({ ...value, [name]: value });
  };
  const Submit = (e) => {
    e.preventDefault();
    console.log();
  };

  const Error = () => (
    <>{error && <div className="alert alert-danger">{error}</div>} </>
  );
  const Success = () => (
    <>{success && <div className="alert alert-success">Post created</div>} </>
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
            name="body"
            className="form-control"
            onChange={Change}
            value={body}
            row="30"
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
          <h2 className="mb-5">New Post</h2>
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
});

export default connect(mapStateToProps, null)(CreatePost);
