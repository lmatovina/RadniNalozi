import axios from 'axios'

const API_URL = 'http://localhost:3000/api/nalozi'
const API_URL_TIPOVI_NALOGA = 'http://localhost:3000/api/tipovi-naloga'
const API_URL_ULOGE = 'http://localhost:3000/api/uloge'


const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getAllTipoviNaloga = async () => {
  const res = await axios.get(`${API_URL_TIPOVI_NALOGA}/naziv-tipa-naloga`, { headers: getAuthHeader() })
  return res.data
}

export const getAllUloge = async () => {
  const res = await axios.get(`${API_URL_ULOGE}/naziviUloga`, { headers: getAuthHeader() })
  return res.data
}

export const getAllNalozi = async () => {
  const res = await axios.get(`${API_URL}`, { headers: getAuthHeader() })
  return res.data
}

export const getNaloziByYear = async (page, limit) => {
  const res = await axios.get(`${API_URL}/godina?page=${page}&limit=${limit}`, { headers: getAuthHeader() })
  return res.data
}

export const getNadolazeciNalozi = async (days, page, limit) => {
  const res = await axios.get(`${API_URL}/nadolazeci?dani=${days}&page=${page}&limit=${limit}`, { headers: getAuthHeader() })
  return res.data
}

export const getNalogById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() })
  return res.data
}


export const createNalog = async (nalog) => {
  const res = await axios.post(`${API_URL}/novi`, nalog, { headers: getAuthHeader() })
  return res.data
}

export const updateNalog = async (id, nalog) => {
  const res = await axios.put(`${API_URL}/${id}`, nalog, { headers: getAuthHeader() })
  return res.data
}

export const deleteNalog = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() })
  return res.data
}

export const arhivirajNalog = async (id) => {
  const res = await axios.put(`${API_URL}/${id}/arhiviraj`, {}, { headers: getAuthHeader() })
  return res.data
}


