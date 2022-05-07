const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Running webster warehouse super server");
});

app.listen(port, (res, req) => {
  console.log("listening to port", port);
});
