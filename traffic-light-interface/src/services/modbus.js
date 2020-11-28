import axios from "axios";

const server = axios.create({
  baseURL: "http://192.168.1.70:3333/",
});

export default server;
