import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { API_URL } from "../config";
import { CalcTime, uuid } from "../user/uuid";
import { findPost } from "./apiPost";

const FindPost = ({ jwt, ...props }) => {
  const [find, setFind] = useState("");
  const [result, setResult] = useState([]);
  const [pages, setPages] = useState([]);
  const [pagination, setPagination] = useState(1);

  const renderPost = () => (
    <>
      <div className="col-12 d-flex">
        <div class="card-columns">
          {result.length !== 0 &&
            result.slice((pagination - 1) * 3, pagination * 3).map((p) => (
              <div
                key={uuid()}
                //  className="col-sm-6 col-md-4 col-lg-3 mb-3"
              >
                <div className="card">
                  <Link to={`/post/${p._id}`}>
                    <div
                      className="img-post"
                      style={{
                        backgroundImage: `url(${API_URL}/post/photo/${p._id})`,
                      }}
                    ></div>
                  </Link>
                  <div className="card-body">
                    <h5 className="card-title">
                      {p.title.length > 50
                        ? p.title.slice(0, 100) + " ...more"
                        : p.title}
                    </h5>

                    <p className="card-text">
                      {p.body.length > 50
                        ? p.body.slice(0, 100) + " ...more"
                        : p.body}
                    </p>
                    <div className="post-footer py-2 d-flex justify-content-between">
                      <h6 className=" small m-0 text-muted">
                        Posted by{" "}
                        <Link to={`/profile/${p.postedBy._id}`}>
                          {p.postedBy.name}
                        </Link>
                      </h6>
                      <h6 className="small m-0 text-muted">
                        {CalcTime(p.createdAt)}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );

  const Submit = (e) => {
    e.preventDefault();
    if (!find.trim()) return setResult([]);
    findPost(find)
      .then((data) => {
        setResult(data);
        console.log(data);
        let arr = [];
        let sl = Math.ceil(data.length / 3);
        for (let i = 1; i < sl + 1; i++) arr.push(i);
        setPages(arr);
      })
      .catch((e) => console.log(e));
  };
  const Change = (e) => setFind(e.target.value);

  const form = () => (
    <>
      <form onSubmit={Submit}>
        <div className="input-group mb-3">
          <input
            onChange={Change}
            type="text"
            className="form-control"
            placeholder="Title post..."
          />
          <div className="input-group-append">
            <button className="btn btn-outline-secondary ml-3" type="submit">
              Find Post
            </button>
          </div>
        </div>
      </form>
    </>
  );

  return (
    <>
      <div className="col-12">
        <div className="mb-4">{form()}</div>
      </div>

      {renderPost()}
      {result.length !== 0 && (
        <>
          <div className="col-12 d-flex justify-content-center">
            <ul className="pagination ">
              <li
                onClick={(e) => {
                  if (pagination === 1) return;
                  else setPagination(pagination - 1);
                }}
                style={{ padding: ".5rem 1rem" }}
                className="page-item page-link cursor"
              >
                Previous
              </li>

              {pages.map((p) =>
                p === pagination ? (
                  <li
                    onClick={(e) => {
                      setPagination(p);
                    }}
                    className="page-item page-link cursor"
                    style={{
                      backgroundColor: "#3f51b5",
                      color: "#fff",
                      padding: ".5rem 1rem",
                    }}
                    key={uuid()}
                  >
                    {p}
                  </li>
                ) : (
                  <li
                    onClick={(e) => {
                      setPagination(p);
                    }}
                    className="page-item page-link cursor"
                    style={{ padding: ".5rem 1rem" }}
                    key={uuid()}
                  >
                    {p}
                  </li>
                )
              )}

              <li
                onClick={(e) => {
                  if (pagination === pages.length) return;
                  else setPagination(pagination + 1);
                }}
                style={{ padding: ".5rem 1rem" }}
                className="page-item page-link cursor"
              >
                Next
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  jwt: state.jwt,
});

export default connect(mapStateToProps, null)(FindPost);
