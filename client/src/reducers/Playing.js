export const PlayingReducer = (state = { playing: [] }, action) => {
  switch (action.type) {
    case "SET_PLAYING":
      // const newSongs = [action.payload, ...state.playing];
      return { playing: action.payload };
    default:
      return { ...state };
  }
};
