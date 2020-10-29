import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { API_URL } from "./../config";
import { CalcTime, uuid } from "./../user/uuid";

function Home({ posts, ...props }) {
  const renderPost = () => (
    <>
      {posts.length !== 0 &&
        posts.map((p) => (
          <div key={uuid()} className="col-sm-6 col-md-4 col-lg-3 mb-3">
            <div className="card">
              {/* <img
                className="card-img-top"
                src={`${API_URL}/post/photo/${p._id}`}
              /> */}
              <Link
                to={`/post/${p._id}`}
                className="img-post"
                style={{
                  backgroundImage: `url(${API_URL}/post/photo/${p._id})`,
                }}
              ></Link>
              <div className="card-body">
                <h5 className="card-title">{p.title}</h5>

                <p className="card-text">
                  {p.body.length > 50
                    ? p.body.slice(0, 100) + "...more"
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
    </>
  );

  return (
    <>
      <div className="container">
        <div className="row">
          {/* .col-sm-6.col-md-4.col-lg-3.mb-3 */}
          {renderPost()}
        </div>
      </div>
    </>
  );
}

const mapstate = (state) => ({ posts: state.posts });

export default connect(mapstate, null)(Home);
