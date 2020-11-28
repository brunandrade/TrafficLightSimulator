const Modbus = require("jsmodbus");
const net = require("net");

const socket = new net.Socket();
const client = new Modbus.client.TCP(socket, 250);

const options = {
  host: "127.0.0.1",
  port: 502,
};

socket.on("connect", function () {
  client.readCoils(4, 5).then(function (resp) {
    console.log(resp.response.body);
  }, console.error);
});

socket.connect(options);

module.exports = {
  async index(req, res) {
    let result = null;
    await client.readCoils(4, 5).then(async function (resp) {
      await client.readHoldingRegisters(0, 7).then(function (read) {
        console.log(read);
        result = {
          Coils: resp.response.body.valuesAsArray,
          Registers: read.response.body.valuesAsArray,
        };
      });
    }, console.error);

    return res.json(result != null ? result : null);
    //return res.json({ result });
  },

  async coil(req, res) {
    const { addr } = req.params;
    const { value } = req.params;
    let response = null;

    await client
      .writeSingleCoil(addr, value == 1 ? true : false)
      .then(function (result) {
        response = result;
      });

    return res.json(response);
  },

  async registers(req, res) {
    const { addr } = req.params;
    const { value } = req.params;
    let response = null;

    await client
      .writeSingleRegister(addr, parseInt(value))
      .then(function (result) {
        response = result;
      });

    return res.json(response);
  },
};
