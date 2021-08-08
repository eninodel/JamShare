import React from "react";
import Homepage from "./components/Homepage/Homepage";
import CreatePost from "./components/CreatePost/CreatePost";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/Login/Login";
import ProfilePage from "./components/Profile/ProfilePage";
import TopPosts from "./components/TopPosts/TopPosts";
import Cookies from "js-cookie";

function Router() {
  const accessToken = Cookies.get("accessToken");

  if (accessToken) {
    return (
      <BrowserRouter>
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
      </BrowserRouter>
    );
  } else {
    return <Login />;
  }
}

export default Router;
