import React, { useEffect, useState } from "react";
import "./App.css";
import modBus from "./services/modbus.js";

export default function App() {
  const [coils, setCoils] = useState([]);
  const [registers, setRegisters] = useState([]);
  const [greenValue, setGreenValue] = useState("");
  const [yelowValue, setYelowValue] = useState("");
  const [redValue, setRedValue] = useState("");

  useEffect(() => {
    setInterval(() => {
      GetModbus();
    }, 1000);
    // GetModbus();
  }, []);

  async function GetModbus() {
    await modBus
      .get("mod")
      .then((response) => {
        setCoils(response.data.Coils);
        setRegisters(response.data.Registers);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function HandleModbusTime(type) {
    if (type === "green") {
      console.log("verde");
      HandleSetRegister(greenValue, 3);
    } else if (type === "yelow") {
      console.log("amarelo");
      HandleSetRegister(yelowValue, 5);
    } else if (type === "red") {
      console.log("vermelho");
      HandleSetRegister(redValue, 1);
    }
  }

  async function HandleSetRegister(value, memo) {
    await modBus
      .post(`mod/reg/${memo}/value/${value}`)
      .then((response) => {
        console.log(response);
        GetModbus();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function HandleControleSystem(type) {
    if (type === "on") {
      HandleModBusSystem(4, 1);
      HandleModBusSystem(5, 1);
      HandleSetRegister(5, 0);
    } else if (type === "off") {
      HandleModBusSystem(4, 0);
      HandleModBusSystem(5, 0);
      HandleSetRegister(0, 0);
    }
  }

  async function HandleModBusSystem(memo, value) {
    await modBus
      .post(`mod/coil/${memo}/value/${value}`)
      .then((response) => {
        console.log(response);

        GetModbus();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="App">
      <div className="App-header ">
        <p>SISTEMA DE CONTROLE E MONITORAMENTO DO SEMÁFORO</p>
        <div className="App-body">
          <div className="App-card">
            <p>Monitoramento</p>
            <div className="TrafficLights">
              <div className="traffic">
                <p className="lights"></p>
                <div
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    backgroundColor: "#d34e24",
                    marginBottom: 20,
                    marginTop: 40,
                  }}
                />
                <div
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    backgroundColor: "#38726c",
                    marginBottom: 20,
                    marginTop: 20,
                  }}
                />
                <div
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    backgroundColor: "#f7f052",
                    marginBottom: 20,
                    marginTop: 20,
                  }}
                />
              </div>
              <div className="traffic">
                <p className="lights">Luz</p>
                <p className="lights">Vermelha</p>
                <p className="lights">Verde</p>
                <p className="lights">Amarela</p>
              </div>
              <div className="traffic">
                <p className="lights">Tempo(Presente)</p>
                <p className="lights">{registers[2]}</p>
                <p className="lights">{registers[4]}</p>
                <p className="lights">{registers[6]}</p>
              </div>
              <div className="traffic">
                <p className="lights">Tempo(Preset)</p>
                <p className="lights">{registers[1]}</p>
                <p className="lights">{registers[3]}</p>
                <p className="lights">{registers[5]}</p>
              </div>
            </div>
          </div>
          <div />
          <div className="App-card">
            <p>Controle do semáforo</p>
            <div className="Button-control">
              <button
                className="onButton"
                onClick={() => HandleControleSystem("on")}
              >
                Ligar
              </button>
              <button
                className="offButton"
                onClick={() => HandleControleSystem("off")}
              >
                Desligar
              </button>
            </div>
            <p className="lights">
              Sistema: {coils[0] === 0 ? "Desligado" : "Ligado"}
            </p>
          </div>
          <div className="App-card">
            <p>Controle do tempo do semáforo </p>
            <div className="TrafficLights">
              <div className="traffic">
                <p className="lights">Luz</p>
                <p className="lights">Vermelha</p>
                <p className="lights">Verde</p>
                <p className="lights">Amarela</p>
              </div>
              <div className="traffic">
                <p className="lights">Tempo(Preset)</p>
                <input
                  className="time-input"
                  type="number"
                  value={redValue}
                  onChange={(e) => setRedValue(e.target.value)}
                />
                <input
                  className="time-input"
                  type="number"
                  value={greenValue}
                  onChange={(e) => setGreenValue(e.target.value)}
                />
                <input
                  className="time-input"
                  type="number"
                  value={yelowValue}
                  onChange={(e) => setYelowValue(e.target.value)}
                />
              </div>
              <div className="traffic">
                <p className="lights">Atualizar</p>
                <button
                  className="UpdateTime"
                  onClick={() => HandleModbusTime("red")}
                >
                  Atualizar
                </button>
                <button
                  className="UpdateTime"
                  onClick={() => HandleModbusTime("green")}
                >
                  Atualizar
                </button>
                <button
                  className="UpdateTime"
                  onClick={() => HandleModbusTime("yelow")}
                >
                  Atualizar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
