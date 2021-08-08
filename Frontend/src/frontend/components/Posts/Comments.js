import React from "react";
import { useSelector } from "react-redux";
import axios from "axios";

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
      .post("http://localhost:8000/deleteComment", { commentId })
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
        <p>
          {user}: {body}
        </p>

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