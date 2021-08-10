export const setProduct = (product) => {
  return {
    type: "SET_PRODUCT",
    payload: product,
  };
};
export const setUserId = (userId) => {
  return {
    type: "SET_USERID",
    payload: userId,
  };
};
