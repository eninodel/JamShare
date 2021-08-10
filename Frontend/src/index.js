import React from "react";
import ReactDom from "react-dom";
import App from "./frontend/App"; // causes errors when imported
import "./frontend/index.css";
import { createStore } from "redux";
import { Provider } from "react-redux";
import allReducers from "./reducers/index";

const store = createStore(
  allReducers
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDom.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
