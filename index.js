const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes");
const path = require("path");
require("dotenv").config();
// require("dotenv").config({ path: "./process.env" }); // dev

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(routes);

app.use(express.static("./Frontend/build"));
app.get("*", (request, response) => {
  response.sendFile(path.join(__dirname, "Frontend/build", "index.html"));
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(port);
});
