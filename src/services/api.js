import axios from "axios";

const api = axios.create({
  baseURL: "https://heitortarefasbackend.vercel.app/",
});

export default api;
