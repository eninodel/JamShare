import React from "react";

function DisplaySong({ largeAlbumUrl, title, setHideSearch, setTrack }) {
  return (
    <>
      <div className="displaysong">
        <h1>{title}</h1>
        <img src={largeAlbumUrl} alt="album" />
      </div>
      <button
        type="button"
        onClick={() => {
          setHideSearch(false);
          setTrack({});
        }}
      >
        Choose a different song
      </button>
    </>
  );
}

export default DisplaySong;
