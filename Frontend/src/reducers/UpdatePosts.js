export const UpdatePosts = (state = { number: 0 }, action) => {
  switch (action.type) {
    case "UPDATE_POSTS":
      const oldNum = state.number;
      return { ...state, number: action.payload + oldNum };
    default:
      return state;
  }
};
