const express = require("express");
const app = express();
const port = process.env.port || 8080;
const path = require("path");

const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const session = require("express-session");
const expressValidator = require("express-validator");
const sessionConfig = require(path.join(__dirname, "/sessionConfig.js"));

var users = [{ username: "joe", password: "password" }];
var clicks = 0;

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
  if (request.session.user) {
    if (request.session.clicks) {
      response.render("index", {
        user: request.session.user,
        clicks: request.session.clicks
      });
    } else {
      response.render("index", { user: request.session.user });
    }
  } else {
    response.redirect("/login");
  }
});

app.post("/click", (request, response) => {
  clicks++;
  request.session.clicks = clicks;
  response.redirect("/");
});

app.get("/login", (request, response) => {
  response.render("login");
});

app.post("/login", (request, response) => {
  if (!request.body || !request.body.username || !request.body.password) {
    return response.render("login");
  }
  var requestingUser = request.body;
  var userRecord;
  if (users.length > 0) {
    users.forEach(verifiedUser => {
      if (requestingUser.username === verifiedUser.username) {
        if (requestingUser.password === verifiedUser.password) {
          userRecord = verifiedUser;
          request.session.user = userRecord;
          response.redirect("/");
        } else {
          response.render("login");
        }
      } else {
        response.render("login");
      }
    });
  } else {
    // handles special case for empty 'database' (i.e. users array)
    response.redirect("/signup");
  }
});

app.get("/signup", (request, response) => {
  response.render("signup");
});

app.post("/users", (request, response) => {
  users.push(request.body);
  console.log(users);
  response.render("login");
});

app.listen(port, () => {
  console.log("Spinning with express: Port", port);
});
