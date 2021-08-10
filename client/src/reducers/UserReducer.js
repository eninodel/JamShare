export const UserReducer = (
  state = {
    userId: null,
    product: null,
  },
  action
) => {
  switch (action.type) {
    case "SET_PRODUCT":
      return { ...state, product: action.payload };
    case "SET_USERID":
      return { ...state, userId: action.payload };
    default:
      return state;
  }
};
