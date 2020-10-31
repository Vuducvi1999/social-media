import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { GET_USER } from "../redux/actions/actionTypes";
import { updateUser } from "./apiUser";

const EditProfile = ({ jwt, ...props }) => {
  const init = {
    name: "",
    email: "",
    password: "",
    error: "",
    photo: "",
    about: "",
    success: false,
  };

  const [formSubmit, setFormSubmit] = useState(new FormData());
  const [value, setValue] = useState(init);
  const { email, password, error, success, name, about } = value;
  const { user, token } = jwt;

  useEffect(() => {
    window.scrollTo(0, 0);
    setValue({ ...value, name: jwt.user.name, about: jwt.user.about });
    formSubmit.set("name", jwt.user.name);
    formSubmit.set("about", jwt.user.about);
  }, [jwt]);

  const Change = (e) => {
    const name = e.target.name;
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    formSubmit.set(name, value);
    setValue({ ...value, [name]: value });
  };

  const Submit = (e) => {
    console.log(props.location);
    e.preventDefault();

    updateUser(user._id, token, formSubmit)
      .then((data) => {
        if (data.error) setValue({ ...value, error: data.error });
        else {
          localStorage.setItem("jwt", JSON.stringify(data));
          props.dispatch({ type: GET_USER, payload: data });
          setValue({ ...init, success: true });
        }
      })
      .catch((e) => console.log(e));
  };

  const showError = () => {
    if (error)
      return error === "jwt expired" ? (
        <>
          {
            <div className="alert alert-danger">
              {error},try <Link to="/signin">signin</Link> again
            </div>
          }
        </>
      ) : (
        <> {error ? <div className="alert alert-danger">{error}</div> : ""} </>
      );
  };

  const showSuccess = () => (
    <>
      {success ? (
        <>
          <Redirect to={`/profile/${user._id}`} />
        </>
      ) : (
        ""
      )}
    </>
  );

  const form = () => (
    <form onSubmit={Submit}>
      <div className="form-group">
        <label htmlFor="" className="text-muted">
          Avatar
        </label>
        <input
          type="file"
          name="photo"
          onChange={Change}
          className="form-control-file"
        />
      </div>
      <div className="form-group">
        <label htmlFor="" className="text-muted">
          Name
        </label>
        <input
          type="name"
          name="name"
          className="form-control"
          value={name}
          onChange={Change}
        />
      </div>
      <div className="form-group">
        <label htmlFor="" className="text-muted">
          Email
        </label>
        <input
          type="email"
          name="email"
          className="form-control"
          value={email}
          onChange={Change}
        />
      </div>
      <div className="form-group">
        <label htmlFor="" className="text-muted">
          Password
        </label>
        <input
          type="password"
          name="password"
          className="form-control"
          value={password}
          onChange={Change}
        />
      </div>
      <div className="form-group">
        <label htmlFor="" className="text-muted">
          About yourself
        </label>
        <textarea
          rows="7"
          name="about"
          className="form-control"
          value={about}
          onChange={Change}
        />
      </div>
      <button type="submit" className="btn btn-raised btn-primary">
        Submit
      </button>
    </form>
  );
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h3 className="mb-5">Edit Profile</h3>

          {showError()}
          {showSuccess()}
          {form()}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  jwt: state.jwt,
});

export default connect(mapStateToProps, null)(EditProfile);
