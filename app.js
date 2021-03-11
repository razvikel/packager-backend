const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const path = require("path");
const exec = require("await-exec");
const Docker = require("dockerode");
const docker = new Docker();
const app = express();
app.use(cors());

app.get("/", async (req, res) => {
  res.send("Welcome to the packager!");
});

app.get("/bundle/:packageName", async (req, res) => {
  const { packageName } = req.params;

  try {
    await exec(`pb ${packageName} -x -F ${packageName}.tgz`);
    const tgzPath = path.join(__dirname, `${packageName}.tgz`);
    res.download(tgzPath);
    fs.remove(tgzPath);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get("/docker/images", async (req, res) => {
  const images = await docker.searchImages({ term: "any", limit: 10 });
  res.send(images);
});

app.get("/docker/:imageName", async (req, res) => {
  const { imageName } = req.params;
});

module.exports = app;

app.listen(8080, () => console.log("listening"));
