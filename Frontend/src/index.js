import React from "react";
import ReactDom from "react-dom";
import App from "./frontend/App.js";
import "./frontend/index.css";
import { createStore } from "redux";
import { Provider } from "react-redux";
import allReducers from "./reducers/index";

const store = createStore(
  allReducers
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
