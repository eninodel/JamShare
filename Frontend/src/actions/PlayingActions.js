export const setPlaying = (uri) => {
  return {
    type: "SET_PLAYING",
    payload: uri,
  };
};
