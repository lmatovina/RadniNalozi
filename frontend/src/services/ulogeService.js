// frontend/src/services/ulogeService.js

import axios from 'axios';

const API_URL = 'http://localhost:3000/api/uloge';

/**
 * Pomoćna funkcija za dohvaćanje Authorization headera iz Local Storagea.
 * Definirana je unutar servisa (po uzoru na naloziService).
 */
const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}


/**
 * Dohvaća sve postojeće uloge.
 */
export const getAllUloge = async () => {
    try {
        const headers = getAuthHeader();
        const response = await axios.get(API_URL, { headers });
        return response.data;
    } catch (error) {
        console.error("Greška pri dohvaćanju uloga:", error);
        throw error;
    }
};

/**
 * Kreira novu ulogu na backendu.
 * @param {object} ulogaData - { naziv: string, opis: string, korisnikIds: number[] }
 */
export const createUloga = async (ulogaData) => {
    try {
        const headers = getAuthHeader();
        const response = await axios.post(API_URL, ulogaData, { headers });
        return response.data;
    } catch (error) {
        console.error("Greška pri kreiranju uloge:", error);
        throw error;
    }
};