import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

function NavBar() {
  const userId = useSelector((state) => state.UserReducer.userId);

  return (
    <div className="navbar">
      <Link to={"/"}>
        <h2>Jam Share</h2>
      </Link>
      {userId ? (
        <Link to={"/create"}>Create a Post</Link>
      ) : (
        <Link to={""}>Create a Post</Link>
      )}
      <Link to={"/top"}>Top Posts</Link>
      {userId ? (
        <Link to={"/profile/" + userId}>Profile</Link>
      ) : (
        <Link to={""}>Profile</Link>
      )}
      <Link
        onClick={() => {
          Cookies.remove("accessToken");
          window.location.href = "http://localhost:3000/";
        }}
      >
        Log Out
      </Link>
    </div>
  );
}

export default NavBar;
