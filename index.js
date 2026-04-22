const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("<h1>Hola mundo con Docker 🚀</h1>");
});

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});