import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import useComponentVisible from "../useComponentVisible";
import { ObjectId } from "mongodb";

function CreateComment({
  _id,
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
    const getURL = "http://localhost:8000/lookUpUser?userId=" + userId;
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
    const newComments = [
      ...postComments,
      { user, userId, _id, body, commentId: new ObjectId() },
    ];
    setPostComments(newComments);
    axios
      .post("http://localhost:8000/addComment", { user, userId, _id, body })
      .then((res) => {})
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
