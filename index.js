const express = require("express");
const request = require("request");
const app = express();
app.all("/*", (req, res) => {
  request("https://shuttleproxy.com" + req.url).pipe(res);
});
const PORT = 8080;
 
app.listen(PORT, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", PORT);
})
