import React from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";

function Comments({
  user,
  body,
  commentUserId,
  commentId,
  postComments,
  setPostComments,
}) {
  const userId = useSelector((state) => state.UserReducer.userId);

  const handleDelete = () => {
    const newComments = postComments.filter(
      (comment) => comment.commentId !== commentId
    );
    setPostComments(newComments);
    axios
      .post("/api/deleteComment", { commentId })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <div className="individualComment">
        {/* <p>
          {user}: {body}
        </p> */}
        <div className="userAndBody">
          <Link to={"/profile/" + commentUserId}>
            <p>{user}:</p>
          </Link>
          <p>{body}</p>
        </div>

        {commentUserId === userId && (
          <button
            type="button"
            onClick={() => {
              handleDelete();
            }}
          >
            Delete
          </button>
        )}
      </div>
    </>
  );
}

export default Comments;
