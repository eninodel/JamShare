const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
// const routes = require("./routes");
const path = require("path");
require("dotenv").config();
// require("dotenv").config({ path: "./process.env" });

const app = express();
app.use(cors());
app.use(bodyParser.json());
// app.use(routes);

app.use(express.static(path.join(__dirname, "Frontend", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend", "build", "index.html"));
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(port);
});
