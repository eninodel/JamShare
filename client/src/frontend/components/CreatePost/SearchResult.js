import React from "react";
import { setPlaying } from "../../../actions/PlayingActions";
import { useDispatch } from "react-redux";

function SearchResult({
  artist,
  title,
  uri,
  albumUrl,
  largeAlbumUrl,
  setTrack,
}) {
  const dispatch = useDispatch();
  return (
    <li
      onClick={() => {
        dispatch(setPlaying(uri));
        setTrack({ title, uri, largeAlbumUrl });
      }}
    >
      <img src={albumUrl} alt="album" />
      <div className="liwords">
        <h3>{title}</h3>
        <h2>By {artist}</h2>
      </div>
    </li>
  );
}

export default SearchResult;
