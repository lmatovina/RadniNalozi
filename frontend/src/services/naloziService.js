import axios from 'axios'

const API_URL = 'http://localhost:3000/api/nalozi'


const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getAllNalozi = async () => {
  const res = await axios.get(`${API_URL}`, { headers: getAuthHeader() })
  return res.data
}

export const getNaloziByYear = async (year) => {
  const res = await axios.get(`${API_URL}/godina/${year}`, { headers: getAuthHeader() })
  return res.data
}

export const getNadolazeciNalozi = async (days) => {
  const res = await axios.get(`${API_URL}/nadolazeci?dani=${days}`, { headers: getAuthHeader() })
  return res.data
}

export const getNalogById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() })
  return res.data
}


/*export const createNalog = async (nalog) => {
  const res = await axios.post(API_URL, nalog);
  return res.data;
};*/

