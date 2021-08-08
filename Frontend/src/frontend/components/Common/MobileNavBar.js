import React from "react";
import { useState } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

function MobileNavBar() {
  const userId = useSelector((state) => state.UserReducer.userId);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="smallnavbar">
      <Link to={"/"} id="jam">
        <h2>Jam Share</h2>
      </Link>
      <div className="menu">
        {showMenu && (
          <ul>
            {userId ? (
              <Link to={"/create"}>Create a Post</Link>
            ) : (
              <Link to={"/"}>Create a Post</Link>
            )}
            <Link to={"/top"}>Top Posts</Link>
            {userId ? (
              <Link to={"/profile/" + userId}>Profile</Link>
            ) : (
              <Link to={"/"}>Profile</Link>
            )}
            <Link
              to={""}
              onClick={() => {
                Cookies.remove("accessToken");
                window.location.href = "/";
              }}
            >
              Log Out
            </Link>
          </ul>
        )}
        {showMenu ? (
          <button type="button" onClick={() => setShowMenu(!showMenu)}>
            <MdClose />
          </button>
        ) : (
          <button type="button" onClick={() => setShowMenu(!showMenu)}>
            <MdMenu />
          </button>
        )}
      </div>
    </div>
  );
}

export default MobileNavBar;
