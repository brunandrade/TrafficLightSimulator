const express = require("express");
const ModBus = require("./ModBus");

const routes = express.Router();

routes.get("/mod", ModBus.index);
routes.post("/mod/coil/:addr/value/:value", ModBus.coil);
routes.post("/mod/reg/:addr/value/:value", ModBus.registers);

module.exports = routes;
