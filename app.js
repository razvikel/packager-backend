const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const path = require("path");
const exec = require("await-exec");
const app = express();
app.use(cors());

app.get("/", async (req, res) => {
  res.send("Welcome to the packager!");
});

app.get("/bundle/:packageName", async (req, res) => {
  const { packageName } = req.params;

  try {
    await exec(`pb ${packageName} -x -F ${packageName}.tgz`, { log: true });
    const tgzPath = path.join(__dirname, `${packageName}.tgz`);
    res.download(tgzPath);
    fs.remove(tgzPath);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get("/docker/images", async (req, res) => {
  const { term, limit } = req.query;
  const images = await exec(
    `docker search --format "{{.Name}}" --limit=${limit} ${term}`,
    { log: true }
  );

  if (images.stderr) {
    console.error(images.stderr);
    res.sendStatus(500);
  } else {
    res.send(images.stdout.split("\n").filter((img) => img.length > 0));
  }
});

app.get("/docker/*", async (req, res) => {
  const imageName = req.params[0];

  await exec(`docker pull ${imageName}`, { log: true });
  await exec(`docker save ${imageName} > image.tar`, { log: true });
  const tarPath = path.join(__dirname, `image.tar`);
  res.download(tarPath);
  fs.remove(tarPath);
});

module.exports = app;

// app.listen(8080, () => console.log("listening"));
