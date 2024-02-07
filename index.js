const request = require("request");
const express = require("express");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const { Transform } = require("stream");
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
    res.sendFile(path.join(__dirname, "/static/index.html"));
} else{
if(fs.existsSync(path.join(__dirname, "/static" + req.url))){
    res.sendFile(path.join(__dirname, "/static" + req.url));
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
  const proxyRequest = request(req.session.user + req.url);

  proxyRequest.on("response", (proxyResponse) => {
    // Copy headers from the proxyResponse to the res object
    res.set(proxyResponse.headers);
    var url = new URL(req.session.user);
    const spaceReplacer = new Transform({
      transform(chunk, encoding, callback) {
        const modifiedChunk = chunk
          .toString()
          .replaceAll(url.hostname, req.get("host"));
        this.push(modifiedChunk);
        callback();
      },
    });

    // Pipe the modified data to the client with the original headers
    proxyResponse.pipe(spaceReplacer).pipe(res);
  });
});
// Start the server on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
