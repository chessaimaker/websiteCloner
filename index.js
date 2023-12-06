const express = require("express");
const request = require("request");
const app = express();
app.all("/*", (req, res) => {
  request("https://google.com" + req.url).pipe(res);
});
function logger(req, res, next) {
  console.log(req.body);
  next();
}

app.use(logger);
const PORT = 8080;
 
app.listen(PORT, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", PORT);
})
