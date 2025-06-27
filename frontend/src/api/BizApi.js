import axios from "axios";
import { API_SERVER_HOST } from "./common";

const prefix = `${API_SERVER_HOST}/api/biz`;

export const registerBiz = async (bizData) => {
  const res = await axios.post(`${prefix}/register`, bizData);
  return res.data;
};

export const checkBizRegistered = async (ono) => {
  const res = await axios.get(`${prefix}/check/${ono}`);
  return res.data.registered; // true/false
};