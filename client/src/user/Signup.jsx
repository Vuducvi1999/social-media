import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { signupAPI } from "./apiUser";
import "../App.css";
import { GET_ALL_USER } from "../redux/actions/actionTypes";

const Signup = ({ users, ...props }) => {
  const init = {
    name: "",
    email: "",
    password: "",
    error: "",
    photo: "",
    about: "",
    success: false,
    loading: false,
  };

  const [value, setValue] = useState(init);
  let { email, password, loading, error, success, name, about } = value;

  const [formSubmit, setformSubmit] = useState(null);
  useEffect(() => setformSubmit(new FormData()), []);

  const Change = (e) => {
    const name = e.target.name;
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    formSubmit.set(name, value);
    setValue({ ...value, [name]: value });
  };

  const Submit = (e) => {
    e.preventDefault();
    setValue({ ...value, loading: true });
    signupAPI(formSubmit)
      .then((data) => {
        console.log(data);
        if (data.error)
          setValue({ ...value, loading: false, error: data.error });
        else {
          props.dispatch({ type: GET_ALL_USER, payload: [...users, data] });
          setValue({ ...init, success: true });
        }
      })
      .catch((e) => console.log(e));
  };

  const showError = () => (
    <> {error ? <div className="alert alert-danger">{error}</div> : ""} </>
  );
  const showSuccess = () => (
    <>
      {success ? (
        <>
          <div className="card toSignin">
            <h5 className="card-header">New account</h5>
            <div className="card-body">
              <p className="card-text">Sign up success, new account created</p>
              <Link to="/signin" className="btn btn-success btn-raised ">
                Sign in
              </Link>
            </div>
          </div>
          <div className="overlay"></div>
        </>
      ) : (
        ""
      )}
    </>
  );
  const Loading = () => (
    <>{loading ? <h2 className="lead bg-light p-5">Loading...</h2> : ""} </>
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
        <input
          type="text"
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
          <h3 className="mb-5">{"Sign Up"}</h3>
          {Loading()}
          {showError()}
          {showSuccess()}
          {form()}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  users: state.users,
});

export default connect(mapStateToProps, null)(Signup);
