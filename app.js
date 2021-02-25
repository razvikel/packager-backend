const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const npmBundle = require("npm-bundle");
const path = require("path");

const app = express();
app.use(cors());

app.get("/", async (req, res) => {
  res.send("Welcome to the packager!");
});

app.get("/bundle/:packageName", async (req, res) => {
  const { packageName } = req.params;

  try {
    npmBundle([packageName], { verbose: true }, (error, output) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        console.log(`dirname: ${__dirname}`);
        console.log(`file: ${output.file}`);
        const tgzPath = path.join(
          __dirname,
          output.file.slice(0, output.file.length - 1)
        );
        console.log(`tgz path: ${tgzPath}`);
        res.download(tgzPath);
        fs.remove(tgzPath);
      }
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = app;
