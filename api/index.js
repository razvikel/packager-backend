const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const npmBundle = require("npm-bundle");
const path = require("path");

const app = express();
app.use(cors());

app.get("/api/bundle/:packageName", async (req, res) => {
  const { packageName } = req.params;

  npmBundle([packageName], { verbose: true }, (error, output) => {
    if (error) {
      throw error;
    }
    const tgzPath = path.join(
      __dirname,
      "_files",
      output.file.slice(0, output.file.length - 1)
    );
    res.download(tgzPath);
    fs.remove(tgzPath);
  });
});

export default app;
