import React, { useEffect } from "react";
import { connect } from "react-redux";

function Home(props) {
  useEffect(() => {
    console.log(props);
  }, []);
  return (
    <>
      <div>Home</div>
    </>
  );
}

const mapstate = (state) => ({ user: state.user });

export default connect(mapstate, null)(Home);
