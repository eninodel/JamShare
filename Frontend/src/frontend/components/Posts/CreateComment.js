import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import useComponentVisible from "../useComponentVisible";
import uuid from "react-uuid";

function CreateComment({
  post_id,
  postComments,
  setPostComments,
  addComment,
  setAddComment,
}) {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(true, setAddComment);
  const userId = useSelector((state) => state.UserReducer.userId);
  const [body, setBody] = useState("");
  const [user, setUser] = useState();

  useEffect(() => {
    const getURL = "/lookUpUser?userId=" + userId;
    axios
      .get(getURL)
      .then((res) => {
        setUser(res.data.data.user);
      })
      .catch((err) => console.log(err));
  }, [userId]);

  const handleSubmit = (e) => {
    if (!body) return;
    e.preventDefault();
    setAddComment(!addComment);
    const commentId = uuid(); // use uuid for unique ids because Mongo DB ObjectId does not work
    const newComments = [
      ...postComments,
      { user, userId, post_id, body, commentId },
    ];
    setPostComments(newComments);
    axios
      .post("/addComment", { user, userId, post_id, body, commentId })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
    setBody("");
  };

  if (isComponentVisible) {
    return (
      <form
        onSubmit={handleSubmit}
        className="createComment"
        ref={ref}
        onClick={() => {
          setIsComponentVisible(true);
        }}
      >
        <input
          type="text"
          value={body}
          id="body"
          name="body"
          placeholder="Type Comment Here"
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="submitComment">
          <button
            type="submit"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Submit
          </button>
        </div>
      </form>
    );
  } else {
    return null;
  }
}

export default CreateComment;
