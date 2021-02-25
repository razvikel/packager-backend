const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const npmBundle = require("npm-bundle");
const path = require("path");

const app = express();
app.use(cors());
const port = 8080;

app.get("/", async (req, res) => {
  res.send("Welcome to the packager!");
});

app.get("/bundle/:packageName", async (req, res) => {
  const { packageName } = req.params;

  npmBundle([packageName], { verbose: true }, (error, output) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
    } else {
      const tgzPath = path.join(
        __dirname,
        output.file.slice(0, output.file.length - 1)
      );
      res.download(tgzPath);
      fs.remove(tgzPath);
    }
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

module.exports = app;
