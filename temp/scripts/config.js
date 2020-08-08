const axios = require("axios");
//const corsOrigin = "http://localhost:1234"; //disabled for testing
const baseUrl = "http://localhost:3000/";
const socketServerUrl = "http://localhost:8080"
export const post = axios.create({
  method: "POST",
  baseURL: `${baseUrl}`,
  headers: {
    Authorization: localStorage.getItem("Auth")
      ? localStorage.getItem("Auth")
      : null
  },
});

export const get = axios.create({
  method: "GET",
  baseURL: `${baseUrl}`,
  headers: {
    Authorization: localStorage.getItem("Auth")
      ? localStorage.getItem("Auth")
      : null,
  },
});

export const patch = axios.create({
  method: "PATCH",
  baseURL: `${baseUrl}`,
  headers: {
    Authorization: localStorage.getItem("Auth")
      ? localStorage.getItem("Auth")
      : null,
  },
});

export const remove = axios.create({
  method: "DELETE",
  baseURL: `${baseUrl}`,
  headers: {
    Authorization: localStorage.getItem("Auth")
      ? localStorage.getItem("Auth")
      : null,
  },
});

export const getSocketServer = axios.create({
  method: "GET",
  baseURL: `${socketServerUrl}`,
  headers: {
    Authorization: localStorage.getItem("Auth")
      ? localStorage.getItem("Auth")
      : null,
  },
});
/*
//Before fixing cors probleme by disabling web-security tempo
google-chrome  --user-data-dir=”/var/tmp/Chrome” --disable-web-security
*/
