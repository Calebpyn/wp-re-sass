//Description: Index file for wp-18062 back end

//Imports
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

//Dotenv
require("dotenv").config();

//Router file
const routes = require("./routes/offcial-website-server.routes");

//App
const app = express();

//Port
const port = 4000;

//App middlewares
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(routes);

// Middleware to handle raw binary data
app.use(express.raw({ type: "*/*", limit: "50mb" }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Error Manager
app.use((err, req, res, next) => {
  console.log(err);

  res.status(404).json({
    message: err,
  });
});

app.listen(port, () => console.log(`Listening to port: ${port}`));
