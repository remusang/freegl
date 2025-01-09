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
  download(res, "https://github.com/remusang/gl/raw/refs/heads/main/GrowLauncher_v6.1.19.apk", "GrowLauncher_v6.1.19.apk");
});


/*app.get("/", (req, res) => {
  const up = Math.floor(process.uptime());
  const uptime = `${String(Math.floor(up / 3600)).padStart(2, '0')}:${String(Math.floor((up % 3600) / 60)).padStart(2, '0')}:${String(up % 60).padStart(2, '0')}`
  res.json({ message: "free gl & gt. https://discord.gg/invite/powerkuyofficial", growlauncher: `https://${req.get('host')}/gl`, version });
});*/

app.get("/", async(req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GrowLauncher</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #1a1a1a, #333);
            color: white;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 20px;
            overflow: hidden;
        }

        .container {
            background: rgba(0, 0, 0, 0.07);
            padding: 40px;
            border-radius: 12px;
            max-width: 650px;
            width: 100%;
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.6);
            animation: fadeIn 1s ease-in-out;
            border: 2px solid rgba(255, 255, 255, 0.2)
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .title {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 20px;
            color: #d6d6f7;
            text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
        }

        .description {
            font-size: 1.2rem;
            color: #ccc;
            margin-bottom: 30px;
            font-weight: 400;
        }

        .download-button {
            padding: 14px 40px;
            border: none;
            border-radius: 50px;
            font-size: 1.4rem;
            font-weight: bold;
            color: white;
            background: #5b6ed4;
            cursor: pointer;
            transition: background 0.3s ease, transform 0.3s ease;
            outline: none;
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.4);
            border: 2px solid rgba(255, 255, 255, 0.2)
        }

        .download-button:hover {
            background: #4a59b8;
            transform: translateY(-2px);
        }

        .footer {
            font-size: 0.9rem;
            color: #aaa;
            margin-top: 20px;
        }

        .footer a {
            color: #5b6ed4;
            text-decoration: none;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://files.catbox.moe/xdw5jc.png" alt="gl" width="140" height="140">
        <h1 class="title">GrowLauncher</h1>
        <p class="description">🚀 GrowLauncher is a launcher app for Growtopia, it can run Lua scripts, cheat menus and more! 😆</p>
        <button class="download-button" onclick="downloadFile()">⬇️ Download Now!</button>
        <p class="footer">🆕 Supported GT Version: 5.02</p>
        <p class="footer">🌐 This site is not from PowerKuy, but the original source of GrowLauncher comes from PowerKuy. <a href="https://discord.gg/invite/powerkuyofficial" target="_blank">Visit PowerKuy Discord! 💬</a></p>
    </div>

    <script>
        function downloadFile() {
            window.location.href = 'https://freegl.vercel.app/gl';
        }
    </script>
</body>
</html>`)
})

app.use('*', (req, res) => {
  res.redirect('/');
});
                         
app.listen(3000);

module.exports = app
