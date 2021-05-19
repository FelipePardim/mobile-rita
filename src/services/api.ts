import axios from "axios";

let url = "https://backendrita.herokuapp.com/";

// Aqui deverá ser utilizado o IP da maquina em que a API esta rodando.
let urlDev = "http://192.168.100.15:3333";

const api = axios.create({
  baseURL: url,
});

export default api;
