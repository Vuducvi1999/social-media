import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { API_URL } from "../config";
import { CalcTime } from "../user/uuid";

const Users = ({ jwt, allusers, ...props }) => {
  const listUser = (pos) => {
    const arr =
      pos === "left"
        ? allusers.slice(0, Math.floor(allusers.length / 2))
        : allusers.slice(Math.floor(allusers.length / 2));

    return (
      <>
        {allusers
          ? arr.map((p) => (
              <div
                key={p._id}
                className="list-group-item list-group-item-action flex-row d-flex align-items-start"
                style={{ flexFlow: "nowrap" }}
              >
                <div style={{ flexBasis: "20%" }}>
                  <Link to={`/profile/${p._id}`} className="w-100">
                    <div
                      className="avatar-users"
                      style={{
                        backgroundImage: `url(${API_URL}/user/photo/${p._id})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        width: "100%",
                        paddingTop: "100%",
                      }}
                    ></div>
                  </Link>
                </div>
                <div style={{ flexGrow: "1" }}>
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{p.name}</h5>
                    <small className="about-user">
                      <p className="small m-0">
                        join&nbsp;
                        {CalcTime(p.createdAt)}
                      </p>
                    </small>
                  </div>
                  <p>
                    {p.about ? (
                      p.about.length > 100 ? (
                        p.about.slice(0, 100) + "..."
                      ) : (
                        p.about
                      )
                    ) : (
                      <small className="font-italic font-weight-light">
                        Not found user's about
                      </small>
                    )}
                  </p>
                </div>
              </div>
            ))
          : ""}
      </>
    );
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-6 pr-5-md">
          <div className="list-group">{listUser("left")}</div>
        </div>
        <div className="col-12 col-md-6 pl-5-md">
          <div className="list-group">{listUser("right")}</div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  allusers: state.users,
});

export default connect(mapStateToProps, null)(Users);
