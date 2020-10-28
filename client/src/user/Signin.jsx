import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { signinAPI } from "./apiUser";
import { connect } from "react-redux";
import { GET_USER } from "./../redux/actions/actionTypes";

const Signin = ({ location, ...props }) => {
  const init = {
    email: "",
    password: "",
    error: "",
    success: false,
    loading: false,
  };
  const [value, setValue] = useState(init);
  const { email, password, loading, error, success } = value;

  const Change = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const Submit = (e) => {
    e.preventDefault();
    setValue({ ...value, loading: true });
    signinAPI(email, password)
      .then((data) => {
        if (data.error)
          setValue({ ...value, loading: false, error: data.error });
        else {
          setValue({ ...init, success: true });
          props.dispatch({ type: GET_USER, payload: data });
          localStorage.setItem("jwt", JSON.stringify(data));
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
        <Redirect to={location.state ? location.state.prev : "/"} />
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
      <button type="submit" className="btn btn-raised btn-primary">
        Submit
      </button>
    </form>
  );
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h3 className="mb-5">Sign In</h3>
          {Loading()}
          {showError()}
          {showSuccess()}
          {form()}
        </div>
      </div>
    </div>
  );
};

const mapstate = (state) => ({ jwt: state.jwt });

export default connect(mapstate, null)(Signin);
