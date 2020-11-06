import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import FindPost from "../post/FindPost";
import { API_URL } from "./../config";
import { CalcTime, uuid } from "./../user/uuid";

function Home({ posts, ...props }) {
  const [pages, setPages] = useState([]);
  const [pagination, setPagination] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    const temp = Math.ceil(posts.length / 8);
    const res = [];
    for (let i = 1; i < temp + 1; i++) res.push(i);
    setPages(res);
  }, [posts]);

  const renderPost = () => (
    <>
      <div className="col-12 d-flex">
        <div className="card-columns">
          {posts.length !== 0 &&
            posts.slice((pagination - 1) * 8, pagination * 8).map((p) => (
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

  return (
    <>
      <div className="container">
        <div className="row">
          {/* .col-sm-6.col-md-4.col-lg-3.mb-3 */}
          <FindPost />
          <div className="col-12">
            <h2 className="mb-4">New Post</h2>
          </div>
          {renderPost()}
        </div>
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
        <div className="col-12" style={{ marginBottom: "4rem" }}></div>
      </div>
    </>
  );
}

const mapstate = (state) => ({ posts: state.posts });

export default connect(mapstate, null)(Home);
