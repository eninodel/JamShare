import React from "react";
import Cookies from "js-cookie";

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=dfe1eb532747437b9b7d84a113a3933f&response_type=code&redirect_uri=https://www.jam-share.com/&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

function Login() {
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
          Continue without logging in
          <br />
          (Limited experience)
        </a>
      </div>
    </div>
  );
}

export default Login;
