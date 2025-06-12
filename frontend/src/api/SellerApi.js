import axios from "axios"
import { API_SERVER_HOST } from "./common" // 또는 별도 정의

const prefix = `${API_SERVER_HOST}/api/seller`

export const postSellerRegister = async (mno, formData) => {
  const res = await axios.post(`${prefix}/register/${mno}`, formData); 
  return res.data
}

export const getSellerDetail = async (mno) => {
  const res = await axios.get(`${prefix}/${mno}`)
  return res.data
}