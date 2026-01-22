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


/**
 * Dohvaća članove određene uloge.
 * @param {number} ulogaId - ID uloge.
 */
export const getUlogaMembers = async (ulogaId) => {
    try {
        const headers = getAuthHeader();
        // Poziv nove rute
        const response = await axios.get(`${API_URL}/${ulogaId}/members`, { headers });
        return response.data;
    } catch (error) {
        console.error(`Greška pri dohvaćanju članova uloge ${ulogaId}:`, error);
        throw error;
    }
};

/**
 * Uklanja člana iz uloge. Poziva DELETE /api/uloge/:ulogaId/korisnik/:korisnikId.
 * @param {number} ulogaId - ID uloge iz koje se briše član.
 * @param {number} korisnikId - ID korisnika kojeg treba ukloniti.
 */
export const removeMemberFromUloga = async (ulogaId, korisnikId) => {
    try {
        const headers = getAuthHeader();
        
        // KRITIČNO: Kreiranje URL-a mora odgovarati backend ruti: /api/uloge/:ulogaId/korisnik/:korisnikId
        const url = `${API_URL}/${ulogaId}/korisnik/${korisnikId}`; 

        // Slanje DELETE zahtjeva
        const response = await axios.delete(url, { headers });
        
        return response.data;
    } catch (error) {
        console.error("Greška pri uklanjanju člana iz uloge:", error);
        // Propagiramo grešku da bi se prikazala korisniku putem $q.notify
        throw error; 
    }
};


/**
 * Briše cijelu ulogu.
 * @param {number} ulogaId - ID uloge za brisanje.
 */
export const deleteUloga = async (ulogaId) => {
    try {
        const headers = getAuthHeader();
        const response = await axios.delete(`${API_URL}/${ulogaId}`, { headers });
        return response.data;
    } catch (error) {
        console.error("Greška pri brisanju uloge:", error);
        throw error;
    }
};

export const addMembersToUloga = async (ulogaId, korisnikIds) => {
    try {
        const headers = getAuthHeader();
        const response = await axios.post(
            `${API_URL}/${ulogaId}/members`,
            { korisnikIds },
            { headers }
        );
        return response.data;
    } catch (error) {
        console.error("Greška pri dodavanju članova:", error);
        throw error;
    }
};