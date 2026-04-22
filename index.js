const express = require("express");
const app = express();

// 👇 ESTO ES CLAVE EN EASY PANEL
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("<h1>Hola mundo 🚀</h1>");
});

// 👇 ESTO TAMBIÉN ES CLAVE
app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor corriendo en puerto " + PORT);
});