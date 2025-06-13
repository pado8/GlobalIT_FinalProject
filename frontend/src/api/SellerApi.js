import axios from "axios";
import { API_SERVER_HOST } from "./common";

const prefix = `${API_SERVER_HOST}/api/seller`;


export const postSellerRegister = async (mno, payload) => {
  const res = await axios.post(`${prefix}/register/${mno}`, payload);
  return res.data;
};

export const getSellerDetail = async (mno) => {
  const res = await axios.get(`${prefix}/${mno}`);
  return res.data;
};
