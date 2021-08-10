export const setAccessToken = (token) => {
  return {
    type: "SET_ACCESS_TOKEN",
    payload: token,
  };
};

export const setRefreshToken = (token) => {
  return {
    type: "SET_REFRESH_TOKEN",
    payload: token,
  };
};
