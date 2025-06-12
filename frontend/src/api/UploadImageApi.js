import axios from "axios";
import { API_SERVER_HOST } from "./common"

const prefix = `${API_SERVER_HOST}`

export const uploadImage = async (files) => {
  const formData = new FormData();
  files.forEach(file => formData.append("uploadFiles", file));

  try {
    const res = await axios.post(`${prefix}/api/uploadAjax`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
  } catch (err) {
    console.error("이미지 업로드 실패", err);
    throw err;
  }
};