const express = require("express");
const routes = require("./routes");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

// app.get("/mod", ModBus.index);
// app.get("/mod/coil/:addr/value/:value", ModBus.coil);
// app.get("/mod/reg/:addr/value/:value", ModBus.registers);

app.listen(3333);
