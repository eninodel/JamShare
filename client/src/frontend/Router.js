import React from "react";
import Homepage from "./components/Homepage/Homepage"; // error here
import CreatePost from "./components/CreatePost/CreatePost"; // fine
import { HashRouter, Route, Switch } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./components/Login/Login";
import ProfilePage from "./components/Profile/ProfilePage"; //error here too
import TopPosts from "./components/TopPosts/TopPosts"; // error here
import Cookies from "js-cookie";

function Router() {
  const accessToken = Cookies.get("accessToken");
  const userId = useSelector((state) => state.UserReducer.userId);
  console.log("userId in Router.js: " + userId);

  if (accessToken === "guest" || (accessToken !== "guest" && userId)) {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/">
            <Homepage />
          </Route>
          <Route path="/create">
            <CreatePost />
          </Route>
          <Route path="/profile/:userId" children={<ProfilePage />}></Route>
          <Route path="/top">
            <TopPosts />
          </Route>
        </Switch>
      </HashRouter>
    );
  } else {
    return <Login />;
  }
}

export default Router;
