import React from "react";
import SearchResult from "./SearchResult";
import { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import Cookies from "js-cookie";
import uuid from "react-uuid";

const spotifyAPI = new SpotifyWebApi({
  clientId: "dfe1eb532747437b9b7d84a113a3933f",
});

function SearchBar({ setTrack, track, setHideSearch, search, setSearch }) {
  const [searchResults, setSearchResults] = useState([]);

  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    spotifyAPI.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search || !accessToken) return;
    let cancel = false; // used to cancel out requests when someone is typing in bursts
    spotifyAPI.searchTracks(search).then((res) => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          );
          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
            largeAlbumUrl: track.album.images[1].url,
          };
        })
      );
    });
    return () => (cancel = true);
  }, [search, accessToken]);
  const handleSubmit = (e) => {
    e.preventDefault();
    setHideSearch(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="searchBar">
        <input
          type="text"
          placeholder="Search for jams!"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <div className="searchresults">
            <ul>
              {searchResults.map((track) => {
                return (
                  <SearchResult {...track} key={uuid()} setTrack={setTrack} />
                );
              })}
            </ul>
            {track.title && (
              <button
                type="submit"
                onClick={handleSubmit}
                className={"searchSubmit"}
              >
                Choose {track.title}
              </button>
            )}
          </div>
        )}
      </form>
    </>
  );
}

export default SearchBar;
