import axios from "axios";
import { API_SERVER_HOST } from "./common";

const prefix = `${API_SERVER_HOST}/api/orders`;

//목록
export const getOrderList = async (page = 1, size = 5) => {
  const res = await axios.get(`${prefix}/list`, {
    params: {page,size}
  });
  return res.data;
};