import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Post from "./Post";
import uuid from "react-uuid";

function DisplayPosts({ extension, setDisplayPosts }) {
  const [posts, setPosts] = useState([]);
  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    if (!accessToken) return null;
    const URL = "http://localhost:8000/" + extension;
    axios
      .get(URL)
      .then((res) => {
        if (res.data.data.length === 0) setDisplayPosts(false);
        setPosts(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accessToken, extension]);

  const handleDeletePost = (deletedPost) => {
    const postsCopy = [...posts];
    const indexToDelete = postsCopy
      .map((data) => data._id)
      .indexOf(deletedPost);
    postsCopy.splice(indexToDelete, 1);
    setPosts(postsCopy);
  };

  const determineClassName = (num) => {
    if (num === 1) return "displayPosts one";
    if (num === 2) return "displayPosts two";
    if (num === 3) return "displayPosts three";
    else return "displayPosts";
  };

  return (
    <div className={determineClassName(posts.length)}>
      {posts.map((data) => {
        return (
          <Post
            key={uuid()}
            user={data.user}
            userId={data.userId}
            body={data.body}
            likes={data.likes}
            image={data.image}
            comments={data.comments}
            date={data.date}
            _id={data._id}
            uri={data.uri}
            userProfilePic={data.userProfilePic}
            name={data.name}
            handleDeletePost={handleDeletePost}
          />
        );
      })}
    </div>
  );
}

export default DisplayPosts;
