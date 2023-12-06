const express = require("express");
const request = require("request");
app.all("/*", (req, res) => {
  request("https://google.com" + req.url).pipe(res);
});
function logger(req, res, next) {
  console.log(req.body);
  next();
}

app.use(logger);
