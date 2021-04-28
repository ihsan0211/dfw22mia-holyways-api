const express = require("express");
const router = require("./routers");

const app = express();

const PORT = 5000;

app.use(express.json());

app.use("/api/v1", router);

app.all("*", (req, res) =>
  res.send("You've tried reaching a route that doesn't exist.")
);

app.listen(PORT, () => console.log(`running on http://localhost:${PORT}`));
