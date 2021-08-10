import { useEffect, React } from "react";
import UseAuth from "./components/useAuth";
import Player from "./components/Common/Player";
import Router from "./Router";
import SpotifyWebApi from "spotify-web-api-node";
import { setUserId, setProduct } from "../actions/UserActions";
import { useDispatch, useSelector } from "react-redux";
import { positions, Provider } from "react-alert";
import AlertMUITemplate from "react-alert-template-mui";
import Cookies from "js-cookie";
import defaultImgAddress from "./components/Common/DefaultImage";
import axios from "axios";

let code = new URLSearchParams(window.location.search).get("code");

const spotifyAPI = new SpotifyWebApi({
  clientId: "dfe1eb532747437b9b7d84a113a3933f",
});

const options = {
  timeout: 15000,
  position: positions.TOP_CENTER,
  offset: "500px",
  containerStyle: {
    zIndex: 1000,
    margin: 0,
    padding: 0,
  },
};

function App() {
  const dispatch = useDispatch();
  let accessToken = Cookies.get("accessToken");

  if (!accessToken) {
    accessToken = UseAuth(code);
  }
  let playing = useSelector((state) => state.PlayingReducer.playing);

  useEffect(() => {
    if (!accessToken || accessToken === "guest") return;
    spotifyAPI.setAccessToken(accessToken);
    spotifyAPI
      .getMe()
      .then((res) => {
        dispatch(setProduct(res.body.product));
        if (res.body.id) dispatch(setUserId(res.body.id));
        let userProfilePic = null;
        if (res.body.images.length !== 0) {
          userProfilePic = res.body.images[0].url;
        } else {
          userProfilePic = defaultImgAddress;
        }
        return {
          userId: res.body.id,
          user: res.body.display_name,
          userProfilePic: userProfilePic,
        };
      })
      .then((data) => {
        const getURL = "/api/lookUpUser?userId=" + data.userId;
        axios
          .get(getURL)
          .then((res) => {
            let bio = "";
            if (res.data.data) {
              bio = res.data.data.bio;
              if (
                data.userProfilePic === defaultImgAddress &&
                res.data.data.userProfilePic &&
                res.data.data.userProfilePic !== defaultImgAddress
              ) {
                // keep original image
                return {
                  ...data,
                  userProfilePic: res.data.data.userProfilePic,
                  bio: bio,
                };
              }
            }
            return { ...data, bio: bio };
          })
          .then((data) => {
            axios
              .post("/api/addUser", {
                userId: data.userId,
                user: data.user,
                userProfilePic: data.userProfilePic,
                bio: data.bio,
              })
              .then((data) => {
                // console.log(data);
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }, [accessToken]);

  return (
    <Provider template={AlertMUITemplate} {...options}>
      <Router />
      {playing.length > 0 && <Player />}
    </Provider>
  );
}

export default App;
