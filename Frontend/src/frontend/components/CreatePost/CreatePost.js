import React from "react";
import SearchBar from "./SearchBar";
import DisplaySong from "./DisplaySong";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import MainNav from "../Common/MainNav";

function CreatePost() {
  const userId = useSelector((state) => state.UserReducer.userId);
  const playing = useSelector((state) => state.PlayingReducer.playing);

  const [user, setUser] = useState();
  const [userProfilePic, setUserProfilePic] = useState();
  const [hideSearch, setHideSearch] = useState(false);
  const [track, setTrack] = useState({});
  const [search, setSearch] = useState();
  const [body, setBody] = useState("");
  const history = useHistory();

  useEffect(() => {
    const getURL = "http://localhost:8000/lookUpUser?userId=" + userId;
    axios
      .get(getURL)
      .then((res) => {
        setUserProfilePic(res.data.data.userProfilePic);
        setUser(res.data.data.user);
      })
      .catch((err) => console.log(err));
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!track) return;
    axios
      .post("http://localhost:8000/createPost", {
        user,
        userId,
        userProfilePic,
        uri: playing,
        body,
        date: new Date(),
        image: track.largeAlbumUrl,
        name: track.title,
      })
      .then((res) => {
        history.push("/");
      })
      .catch((err) => {
        history.push("/");
      });
  };

  return (
    <>
      <div className="hero" id="create">
        <h1>Create a New Post</h1>
      </div>
      <form className="createpost" onSubmit={handleSubmit}>
        <MainNav />
        {!hideSearch ? (
          <SearchBar
            setTrack={setTrack}
            track={track}
            setHideSearch={setHideSearch}
            search={search}
            setSearch={setSearch}
          />
        ) : (
          <DisplaySong
            {...track}
            setHideSearch={setHideSearch}
            setTrack={setTrack}
          />
        )}
        {!hideSearch ? (
          <div className="bodyWide">
            <input
              type="text"
              id="body"
              name="body"
              placeholder="Type post here"
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
              }}
            />
          </div>
        ) : (
          <div className="bodySmall">
            <input
              type="text"
              id="body"
              name="body"
              placeholder="Type post here"
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
              }}
            />
          </div>
        )}
        {hideSearch && body && (
          <button type="submit" onClick={handleSubmit}>
            Submit post
          </button>
        )}
      </form>
      <div className="bottomNav"></div>
    </>
  );
}

export default CreatePost;
