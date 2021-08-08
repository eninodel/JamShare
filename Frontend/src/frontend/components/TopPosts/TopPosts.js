import React from "react";
import MainNav from "../Common/MainNav";
import DisplayPosts from "../Posts/DisplayPosts";

function TopPosts() {
  return (
    <div className="TopPosts">
      <MainNav />
      <div className="hero" id="top">
        <h1>Top Posts</h1>
      </div>

      <DisplayPosts extension={"topPosts"} setDisplayPosts={() => {}} />
      <div className="bottomNav"></div>
    </div>
  );
}

export default TopPosts;
