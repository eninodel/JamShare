const TokenReducer = (
  state = { accessToken: null, refreshToken: null },
  action
) => {
  switch (action.type) {
    case "SET_ACCESS_TOKEN":
      return { ...state, accessToken: action.payload };
    case "SET_REFRESH_TOKEN":
      return { ...state, refreshToken: action.payload };
    default:
      return state;
  }
};

export default TokenReducer;

// overall state = {
//     user,
//     userId,
//     userProfilePic,
//     playing,
// accessToken,
// refreshToken,
// }
