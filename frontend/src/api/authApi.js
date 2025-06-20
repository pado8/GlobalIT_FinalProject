import axios from "axios";
import { API_SERVER_HOST } from "./common";

const prefix = `${API_SERVER_HOST}/api/auth`;

export const checkAuth = async () => {
  const response = await axios.get(`${prefix}/me`, {
    withCredentials: true, //  JSESSIONID 쿠키 포함 필수
  });

  return response.data; // { userId, nickname, role, mno }
};
