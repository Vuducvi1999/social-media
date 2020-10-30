import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { API_URL } from "../config";
import { CalcTime, uuid } from "../user/uuid";
import FindUser from "./FindUser";

const Users = ({ jwt, allusers, ...props }) => {
  const [pages, setPages] = useState([]);
  const [pagination, setPagination] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    let sl = 0;
    let arr = [];
    if (allusers) sl = Math.ceil(allusers.length / 10);
    for (let i = 1; i < sl + 1; i++) arr.push(i);
    setPages(arr);
    console.log(allusers.length);
  }, [allusers]);

  const listUser = (pos) => {
    const arr =
      pos === "left"
        ? allusers.slice((pagination - 1) * 10, (pagination - 1) * 10 + 5)
        : allusers.slice((pagination - 1) * 10 + 5, (pagination - 1) * 10 + 10);

    return (
      <>
        {allusers
          ? arr.map((p) => (
              <div
                key={p._id}
                className="list-group-item list-group-item-action flex-row d-flex align-items-start"
                style={{ flexFlow: "nowrap" }}
              >
                <div style={{ flexBasis: "20%", flexShrink: 0 }}>
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
                  <div className="d-flex w-100 justify-content-between align-items-center">
                    <h5 className="mb-1 font-weight-bold text-primary">
                      <Link to={`/profile/${p._id}`}> {p.name}</Link>
                    </h5>
                    <small className="about-user">
                      <p className="small m-0">
                        joined&nbsp;
                        {CalcTime(p.createdAt)}
                      </p>
                    </small>
                  </div>
                  <p>
                    {p.about ? (
                      p.about.length > 200 ? (
                        p.about.slice(0, 200) + "..."
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
        <FindUser />
        <div className="col-12 mb-3">
          <h2>All Users</h2>
        </div>
        <div className="col-12 col-md-6 pr-5-md">
          <div className="list-group">{listUser("left")}</div>
        </div>
        <div className="col-12 col-md-6 pl-5-md">
          <div className="list-group">{listUser("right")}</div>
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
    </div>
  );
};

const mapStateToProps = (state) => ({
  allusers: state.users,
});

export default connect(mapStateToProps, null)(Users);
