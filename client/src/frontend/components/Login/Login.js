import React from "react";
import Cookies from "js-cookie";
import { useAlert } from "react-alert";

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=dfe1eb532747437b9b7d84a113a3933f&response_type=code&redirect_uri=https://www.jam-share.com/&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

function Login() {
  const alert = useAlert();
  const accesssToken = Cookies.get("accessToken");

  const showAlert = () => {
    if (accesssToken === "invalid") {
      Cookies.remove("accessToken");
      alert.show(
        "To login with Spotify please contact Edwin Nino Delgado. For now please login as a guest",
        {
          title: "Login Error",
        }
      );
    } else {
      return null;
    }
  };

  return (
    <div className="login">
      <h1>Jam Share</h1>
      <div className="loginButtonContainer">
        <button onClick={() => (window.location.href = AUTH_URL)}>
          Login with Spotify
        </button>
        <a
          href="/"
          onClick={() => {
            Cookies.set("accessToken", "guest", { expires: 1 / 24 });
          }}
        >
          Continue as a guest
        </a>
      </div>
      {showAlert()}
    </div>
  );
}

export default Login;
