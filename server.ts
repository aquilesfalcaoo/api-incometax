import { IRMensalController } from "./controllers/IRMensalController";

const irmensalController = new IRMensalController();
const express = require("express");
const app = express();

app.use(express.json());
app.post("/irmensal/calcularIRM", irmensalController.calcularIRM);
app.listen(7777, () => console.log("Servidor Executado com Sucesso!"));
