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
export const getKasniNalozi = async (page, limit) => {
  const res = await axios.get(`${API_URL}/kasni?page=${page}&limit=${limit}`, { headers: getAuthHeader() })
  return res.data
}

export const getZavrseniKasnjenje = async (page, limit) => {
  const res = await axios.get(`${API_URL}/zavrseni-kasni?page=${page}&limit=${limit}`, { headers: getAuthHeader() });
  return res.data;
};

export const getNadolazeciNalozi = async (days, page, limit) => {
  const res = await axios.get(`${API_URL}/nadolazeci?dani=${days}&page=${page}&limit=${limit}`, { headers: getAuthHeader() })
  return res.data
}

export const getNalogById = async (id, page, limit) => {
  const res = await axios.get(`${API_URL}/${id}&page=${page}&limit=${limit}`, { headers: getAuthHeader() })
  return res.data
}

export const getKorisnikNalogById = async (id, page, limit) => {
  const res = await axios.get(
    `${API_URL}/korisnici/${id}?page=${page}&limit=${limit}`,
    { headers: getAuthHeader() }
  );
  return res.data;
};

export const updateZatvoriNalog = async (nalog_id) => {
  const res = await axios.patch(
    `${API_URL}/zatvori/${nalog_id}`,
    {},
    { headers: getAuthHeader() }
  );
  return res.data;
};

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

export const exportZavrseniKasniExcel = async () => {
  const res = await axios.get(
    `${API_URL}/export/zavrseni-kasni`,
    {
      headers: getAuthHeader(),
      responseType: "blob"
    }
  );

  return res.data;
};

export const exportKasniExcel = async () => {
  const res = await axios.get(
    `${API_URL}/export/kasni`,
    {
      headers: getAuthHeader(),
      responseType: "blob"
    }
  );

  return res.data;
};



