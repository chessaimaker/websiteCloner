const request = require("request");
const express = require("express");
const session = require("express-session");
const app = express();

// Set up session middleware
app.use(
  session({
    secret: "Url",
    resave: false,
    saveUninitialized: true,
  }),
);

// Middleware to check if the user has a valid session
const checkSession = (req, res, next) => {
  if (req.session && req.session.user && req.session.user != "none") {
    next(); // Allow access if a valid session exists
  } else {
if(req.url == "/"){
    res.sendFile("/index.html");
} else{
if(fs.existsSync("static" + req.url)){
    res.sendFile("static" + req.url);
} else{
    res.status(404).send("404 page not found");
}
}
  }
};

// Route that sets up a session for the first person
app.get("/clone-website/:id1", (req, res) => {
  req.session.user = atob(req.params.id1); // Set a unique identifier for the user
  res.redirect("/");
});
app.get("/unclone-website", (req, res) => {
  req.session.user = "none"; // Set a unique identifier for the user
  res.redirect("/");
});
app.get("/unclone-website/", (req, res) => {
  req.session.user = "none"; // Set a unique identifier for the user
  res.redirect("/");
});
app.all("/*", checkSession, (req, res) => {
  request(req.session.user + req.url, function (error, response, body) {
    // Print the error if one occurred // Print the response status code if a response was received
    var url = new URL(req.session.user);
    body = body.replaceAll(url.hostname, req.get("host"));
    if (error) {
      body = error;
    }
  }).pipe(res);
});
// Start the server on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
