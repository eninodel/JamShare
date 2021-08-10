import React from "react";
import { useState, useEffect } from "react";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { setPlaying } from "../../../actions/PlayingActions";
import Comments from "./Comments";
import CreateComment from "./CreateComment";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import uuid from "react-uuid";

function Post({
  user,
  userId,
  body,
  likes,
  comments,
  image,
  date,
  post_id,
  uri,
  userProfilePic,
  name,
  handleDeletePost,
}) {
  let currentUserId = useSelector((state) => state.UserReducer.userId);
  const dispatch = useDispatch();
  const [addComment, setAddComment] = useState(false);
  const [postComments, setPostComments] = useState([...comments]);
  const [liked, setLiked] = useState();
  const [showComments, setShowComments] = useState(false);
  const [days, setDays] = useState(0);
  const alert = useAlert();

  useEffect(() => {
    likes ? setLiked([...likes]) : setLiked([]);
    const pastDate = new Date(date);
    const today = new Date();
    const difference = today.getTime() - pastDate.getTime();
    const differenceInDays = Math.round(difference / (1000 * 3600 * 24));
    setDays(differenceInDays);
  }, []);

  const handleLiked = (newLikes) => {
    axios
      .post("/api/updateLikes", {
        post_id: post_id,
        newLikes,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log("error at Post.js: " + err);
      });
  };

  const displayLikesIcon = () => {
    if (!liked) return <MdFavoriteBorder />;
    else {
      if (liked.includes(currentUserId)) {
        return <MdFavorite />;
      } else {
        return <MdFavoriteBorder />;
      }
    }
  };
  const handleDelete = () => {
    axios
      .post("/api/deletePost", { _id: post_id })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    handleDeletePost(post_id);
  };

  const renderAddComment = () => {
    if (!currentUserId) return null;
    if (addComment) {
      return (
        <CreateComment
          post_id={post_id}
          postComments={postComments}
          setPostComments={setPostComments}
          addComment={addComment}
          setAddComment={setAddComment}
        />
      );
    } else {
      return (
        <div className="addAComment">
          <button type="button" onClick={() => setAddComment(!addComment)}>
            Add a comment
          </button>
        </div>
      );
    }
  };

  return (
    <div className="post">
      <div className="postTop">
        <img src={userProfilePic} alt="user" />
        <Link to={"/profile/" + userId}>
          <h4>{user}</h4>
        </Link>
        <div></div>
        {userId === currentUserId && (
          <div className="submitComment" id="delete">
            <button type="button" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
      </div>
      <h5>{body}</h5>
      <div className="postSong" onClick={() => dispatch(setPlaying(uri))}>
        <p>{name}</p>
      </div>
      {days > 0 ? (
        days > 1 ? (
          <h6>Posted {days} days ago</h6>
        ) : (
          <h6>Posted Yesterday</h6>
        )
      ) : (
        <h6>Posted today</h6>
      )}
      <img
        src={image}
        alt="post pic"
        onClick={() => {
          dispatch(setPlaying(uri));
        }}
      />
      <div
        className="likes"
        onClick={() => {
          if (!currentUserId) {
            alert.show("Login with Spotify to like posts", {
              title: "Invalid Action",
            });
            return;
          }
          if (!liked) {
            handleLiked([...liked, currentUserId]);
            setLiked([...liked, currentUserId]);
            return;
          }
          if (liked.includes(currentUserId)) {
            const index = liked.indexOf(currentUserId);
            if (liked.length > 1) {
              setLiked([...liked.splice(index, 1)]);
              handleLiked([...liked.splice(index, 1)]);
            } else {
              setLiked([]);
              handleLiked([]);
            }
          } else {
            setLiked([...liked, currentUserId]);
            handleLiked([...liked, currentUserId]);
          }
        }}
      >
        <p>{liked ? liked.length : 0}</p>
        {displayLikesIcon()}
      </div>

      {!showComments && postComments.length > 0 && (
        <div
          onClick={() => {
            setShowComments(!showComments);
          }}
          className="showcomments"
        >
          <p>Show comments ({postComments.length})</p>
        </div>
      )}
      {showComments && (
        <div className="commentSection">
          {postComments.map((comment) => {
            return (
              <Comments
                key={uuid()}
                {...comment}
                commentUserId={comment.userId}
                postComments={postComments}
                setPostComments={setPostComments}
              />
            );
          })}
        </div>
      )}
      {showComments && postComments.length > 0 && (
        <div
          onClick={() => {
            setShowComments(!showComments);
          }}
          className="showcomments"
        >
          <p>Hide comments</p>
        </div>
      )}
      {renderAddComment()}
    </div>
  );
}

export default Post;
