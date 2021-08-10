import React from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import { setPlaying } from "../../../actions/PlayingActions";

function Player() {
  const dispatch = useDispatch();
  const trackURI = useSelector((state) => state.PlayingReducer.playing);
  const product = useSelector((state) => state.UserReducer.product);
  const accessToken = Cookies.get("accessToken");

  return (
    <>
      {accessToken !== "guest" && product === "premium" && (
        <div className="player">
          <SpotifyPlayer
            token={accessToken}
            showSaveIcon
            uris={trackURI ? trackURI : []}
            autoPlay={true}
            styles={{ height: 60 }}
            magnifySliderOnHover={true}
            callback={(e) => {
              if (
                !e.isPlaying &&
                !e.isInitializing &&
                e.status !== "INITIALIZING"
              ) {
                dispatch(setPlaying(""));
              }
            }}
          />
        </div>
      )}
    </>
  );
}

export default Player;
