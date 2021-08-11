import React from "react";
import { useEffect } from "react";
import MainNav from "../Common/MainNav";
import DisplayPosts from "../Posts/DisplayPosts"; // error here
import { useAlert } from "react-alert";
import Cookies from "js-cookie";

function Homepage() {
  const accessToken = Cookies.get("accessToken");
  const alert = useAlert();

  useEffect(() => {
    if (accessToken !== "guest") return;
    alert.info(
      "Guest users are not allowed to create, like, or comment on posts. Guest users cannot visit the Profile or Create a Post pages. Login with Spotify to unlock further access.",
      {
        title: "Important Information",
      }
    );
  }, []);

  return (
    <>
      <div className="hero">
        <MainNav />
        <h1>Share Your Favorite Jams Here</h1>
      </div>
      <div className="recents">
        <h2>Recent Posts</h2>
      </div>
      <DisplayPosts extension="recentposts" setDisplayPosts={() => {}} />
      <div className="bottomNav"></div>
    </>
  );
}

export default Homepage;
