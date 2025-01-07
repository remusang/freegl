const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser')

const app = express();
app.set("json spaces", 4);
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const download = async (res, url, filename) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.arrayBuffer();
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-Type", "application/vnd.android.package-archive");
    res.send(Buffer.from(data));  // Sending the file as a buffer
  } catch {
    res.status(500).json({ message: "Download failed" });
  }
};
const getDirect = async (url) => {
  const response = await fetch("https://api.agatz.xyz/api/mediafire?url=" + url)
  const data = await response.json()
  return data.data[0]?.link
};

const { gl, gt, version } = require("./main.json");

app.use((req, res, next) => {
  res.setHeader('viewport', 'width=device-width, initial-scale=1.0');
  next();
});

app.get("/gl", async (req, res) => {
  const fileUrl = await getDirect(gl);
  download(res, fileUrl, "GrowLauncher_v6.1.17.apk");
});


app.get("/", (req, res) => {
  const up = Math.floor(process.uptime());
  const uptime = `${String(Math.floor(up / 3600)).padStart(2, '0')}:${String(Math.floor((up % 3600) / 60)).padStart(2, '0')}:${String(up % 60).padStart(2, '0')}`
  res.json({ message: "free gl & gt. https://discord.gg/invite/powerkuyofficial", growlauncher: `https://${req.get('host')}/gl`, version });
});

app.use('*', (req, res) => {
  res.redirect('/');
});
                         
app.listen(3000);

module.exports = app
