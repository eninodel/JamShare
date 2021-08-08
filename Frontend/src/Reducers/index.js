import { PlayingReducer } from "./Playing";
import TokenReducer from "./TokenReducer";
import { UserReducer } from "./UserReducer";
import { UpdatePosts } from "./UpdatePosts";
import { combineReducers } from "redux";

const allReducers = combineReducers({
  PlayingReducer,
  TokenReducer,
  UserReducer,
  UpdatePosts,
});

export default allReducers;
