const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser')

const app = express();
app.set("json spaces", 2);
app.use(cors());
app.use(bodyParser.json())

const download = async (res, url, filename) => {
  try {
    const { data } = await axios({ url, responseType: "stream" });
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-Type", "application/vnd.android.package-archive");
    data.pipe(res);
  } catch {
    res.status(500).send("Download failed");
  }
};

const getDirect = async (url) => {
  const response = await fetch("https://api.agatz.xyz/api/mediafire?url=" + url)
  const data = await response.json()
  return data.data[0]?.link
};

const { gl, gt, version } = require("./main.json");

app.get("/gl", async (req, res) => {
  const fileUrl = await getDirect(gl);
  download(res, fileUrl, "GrowLauncher_v6.1.17.apk");
});

app.get("/gt", (req, res) => {
  download(res, gt, "Growtopia_v4.71.apk");
});

app.get("/", (req, res) => {
  res.json({ message: "free gl & gt. https://discord.gg/invite/powerkuyofficial", growlauncher: `${req.protocol}://${req.get('host')}/gl`, growtopia: `${req.protocol}://${req.get('host')}/gt`, version });
});

app.listen(3000);

module.exports = app
