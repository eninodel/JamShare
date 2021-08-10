import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function UseAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  useEffect(() => {
    // gets the token
    if (!code) return null;
    if (code === "guest") {
      Cookies.set("accessToken", "guest", { expires: 1 / 24 });
      setAccessToken("guest");
      setRefreshToken("guest");
      setExpiresIn(3600);
      return;
    }
    axios
      .post("api/login", { code })
      .then((res) => {
        console.log("useAuth /login response: " + res.data);
        Cookies.set("accessToken", res.data.accessToken, { expires: 1 / 24 });
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);
      })
      .catch(() => {
        window.location = "/";
      });
  }, [code]);

  useEffect(() => {
    // refreshes token
    if (!refreshToken || !expiresIn || accessToken === "guest") return;
    const timeout = setInterval(() => {
      axios
        .post("api/refresh", {
          refreshToken,
        })
        .then((res) => {
          Cookies.set("accessToken", res.data.accessToken, { expires: 1 / 24 });
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);
        });
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(timeout);
  }, [refreshToken, expiresIn]);

  return accessToken;
}
