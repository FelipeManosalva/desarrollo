const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hola Mundo</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0a;
      font-family: 'Space Mono', monospace;
      overflow: hidden;
    }

    .grid {
      position: fixed;
      inset: 0;
      background-image:
        linear-gradient(rgba(0,255,150,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,255,150,0.04) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
    }

    .container {
      text-align: center;
      position: relative;
      z-index: 1;
    }

    .label {
      font-size: 0.7rem;
      letter-spacing: 0.3em;
      color: #00ff96;
      text-transform: uppercase;
      margin-bottom: 1rem;
      opacity: 0;
      animation: fadeUp 0.6s ease forwards 0.2s;
    }

    h1 {
      font-size: clamp(3rem, 10vw, 7rem);
      font-weight: 700;
      color: #f0f0f0;
      line-height: 1;
      letter-spacing: -0.03em;
      opacity: 0;
      animation: fadeUp 0.7s ease forwards 0.4s;
    }

    h1 span { color: #00ff96; }

    .line {
      width: 60px;
      height: 2px;
      background: #00ff96;
      margin: 1.5rem auto;
      opacity: 0;
      animation: expand 0.5s ease forwards 0.8s;
      transform-origin: center;
      transform: scaleX(0);
    }

    .sub {
      font-size: 0.75rem;
      color: #444;
      letter-spacing: 0.15em;
      opacity: 0;
      animation: fadeUp 0.6s ease forwards 1s;
    }

    .cursor {
      display: inline-block;
      width: 2px;
      height: 1em;
      background: #00ff96;
      margin-left: 4px;
      vertical-align: middle;
      animation: blink 1s step-end infinite;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes expand {
      from { opacity: 1; transform: scaleX(0); }
      to   { opacity: 1; transform: scaleX(1); }
    }
    @keyframes blink { 50% { opacity: 0; } }
  </style>
</head>
<body>
  <div class="grid"></div>
  <div class="container">
    <p class="label">Node.js + Express</p>
    <h1>Hola<br><span>Mundo</span><span class="cursor"></span></h1>
    <div class="line"></div>
    <p class="sub">corriendo en el puerto ${PORT}</p>
  </div>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
