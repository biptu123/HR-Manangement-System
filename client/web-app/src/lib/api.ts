import axios from "axios";

export const api = axios.create({
  baseURL: "https://hrms-api.walgi.com",
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: "application/json",
  },
});
