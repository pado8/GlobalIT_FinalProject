// import axios from "axios"

//서버 주소
export const API_SERVER_HOST = 'http://localhost:8080'
const prefix = `${API_SERVER_HOST}/api/community`

export const getOne = async (pno) => {
    const res = await axios.get(`${prefix}/${pno}`, {params: { t: Date.now() } })
    return res.data
}

// export const getList = async (pageParam) => {
//     const { page, size } = pageParam
//     const res = await axios.get(`${prefix}/list`, { params: { page: page, size: size } })
//     return res.data
// }

export const postWrite = async (communityObj) => {
    const res = await axios.post(`${prefix}/`, communityObj)
    return res.data
}

export const deleteOne = async (pno) => {
    const res = await axios.delete(`${prefix}/${pno}`)
    return res.data
}

export const updateOne = async (pno, communityDTO) => {
    const res = await axios.put(`${prefix}/${pno}`, communityDTO)
    return res.data
};