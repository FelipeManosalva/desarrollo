const express = require("express");
const app = express();

// 👇 ESTO ES LO MÁS IMPORTANTE
const PORT = process.env.PORT || process.env.APP_PORT || 3000;

app.get("/", (req, res) => {
  res.send("<h1>Hola mundo 🚀</h1>");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor corriendo en puerto " + PORT);
});