// src/services/korisniciService.js

import axios from 'axios'


const API_URL = 'http://localhost:3000/api/korisnici'



const getAuthHeader = () => {
  // Pretpostavlja se da se token zove 'token' u localStorage-u
  const token = localStorage.getItem('token') 
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/**
 * Dohvaća listu svih korisnika.
 * @returns {Promise<Array>} Lista objekata korisnika
 */
export const getAllKorisnici = async (page, limit) => {
  const res = await axios.get(`${API_URL}?page=${page}&limit=${limit}`, { headers: getAuthHeader() })
  return res.data
}

/**
 * Kreira novog korisnika.
 * @param {Object} korisnik - Objekt s ime, prezime, email, lozinka, je_supervizor
 * @returns {Promise<Object>} 
 */
export const createKorisnik = async (korisnik) => {
  const res = await axios.post(API_URL, korisnik, { headers: getAuthHeader() })
  return res.data
}




/**
 * Ažurira status 'je_supervizor' za određenog korisnika.
 * @param {number} id - ID korisnika
 * @param {boolean} je_supervizor - Novi status (true ili false)
 * @returns {Promise<Object>} Poruka o uspjehu
 */
export const updateKorisnikSupervizorStatus = async (id, je_supervizor) => {
  const res = await axios.patch(
    `${API_URL}/${id}/supervizor`, 
    { je_supervizor: je_supervizor }, 
    { headers: getAuthHeader() } 
  )
  return res.data
}

/**
 * Pretražuje korisnike po imenu, prezimenu ili emailu
 * @param {string} searchTerm - Termin za pretragu (min 2 znaka)
 */
export const searchKorisnici = async (searchTerm) => {
    try {
        const headers = getAuthHeader();
        const response = await axios.get(`${API_URL}/search`, {
            headers,
            params: { q: searchTerm }
        });
        return response.data;
    } catch (error) {
        console.error("Greška pri pretrazi korisnika:", error);
        return [];
    }
};

export const changePassword = async (data) => {
  const headers = getAuthHeader();
  const res = await axios.put(
    `${API_URL}/change-password`,
    data,
    { headers }
  );
  return res.data;
};
