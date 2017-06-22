const express = require("express");
const app = express();
const port = process.env.port || 8080;
const path = require("path");

const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const session = require("express-session");
const expressValidator = require("express-validator");
const sessionConfig = require(path.join(__dirname, "/sessionConfig.js"));

// SET ENGINE
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "/public"));

// MIDDLEWARE
app.use("/", express.static(path.join(__dirname, "/public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(session(sessionConfig));

//ROUTES
app.get("/", (request, response) => {
  if (!request.body.session) {
    response.redirect("/login");
  } else {
    response.render("index");
  }
});

app.get("/login", (request, response) => {
  response.render("login");
});

app.post("/login", (request, response) => {
  response.redirect(path(__dirname));
});

app.listen(port, () => {
  console.log("Spinning with express: Port", port);
});
