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
import SpotifyWebApi from "spotify-web-api-node";
import Cookies from "js-cookie";
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
  const [liked, setLiked] = useState(); // Bool
  const [postLikes, setPostLikes] = useState(); // Arr
  const [showComments, setShowComments] = useState(false);
  const [days, setDays] = useState(0);
  let accessToken = Cookies.get("accessToken");
  const alert = useAlert();
  const [addedToLibrary, setAddedToLibrary] = useState();
  const trackId = uri.slice(14);
  const spotifyAPI = new SpotifyWebApi({
    clientId: "dfe1eb532747437b9b7d84a113a3933f",
  });

  if (currentUserId) spotifyAPI.setAccessToken(accessToken);

  useEffect(() => {
    if (currentUserId) {
      spotifyAPI
        .containsMySavedTracks([trackId])
        .then((res) => setAddedToLibrary(res.body[0]));
    }
    likes ? setPostLikes([...likes]) : setPostLikes([]);
    setLiked(likes.indexOf(currentUserId) !== -1);
    const pastDate = new Date(date);
    const today = new Date();
    const difference = today.getTime() - pastDate.getTime();
    const differenceInDays = Math.round(difference / (1000 * 3600 * 24));
    setDays(differenceInDays);
  }, []);

  const handleLiked = (newLikes) => {
    axios
      .post("/api/updateLikes", {
        _id: post_id,
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
      return <MdFavorite />;
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

  const renderAddToLibrary = () => {
    if (!currentUserId) return null;
    if (addedToLibrary) {
      return (
        <button
          type="button"
          onClick={() => {
            spotifyAPI.removeFromMySavedTracks([trackId]);
            setAddedToLibrary(false);
          }}
        >
          Remove From Library
        </button>
      );
    } else {
      <button
        type="button"
        onClick={() => {
          spotifyAPI.addToMySavedTracks([trackId]);
          setAddedToLibrary(true);
        }}
      >
        Add to Library
      </button>;
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
      <div className="likesAndLibraryContainer">
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
              // liking post
              handleLiked([...postLikes, currentUserId]);
              setPostLikes([...postLikes, currentUserId]);
              setLiked(true);
              return;
            } else {
              // unliking post
              const newPostLikes = postLikes.filter(
                (person) => person !== currentUserId
              );
              handleLiked([...newPostLikes]);
              setPostLikes([...newPostLikes]);
              setLiked(false);
            }
          }}
        >
          <p>{postLikes ? postLikes.length : 0}</p>
          {displayLikesIcon()}
        </div>
        <div className="submitComment" id="addToLibrary">
          {renderAddToLibrary()}
        </div>
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
