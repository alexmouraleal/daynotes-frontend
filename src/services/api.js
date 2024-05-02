import axios from "axios";

const api = axios.create({
  baseURL: "https://heitortarefasbackend.vercel.app/",
  //baseURL: "http://localhost:9001/",
});

//editing in git: aleal

export default api;
