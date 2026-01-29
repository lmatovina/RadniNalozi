import axios from 'axios';

const API_URL = 'http://localhost:3000/api/godine';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {};
};

export const getAllGodine = async () => {
  try {
    console.log('[FRONTEND] Poziv getAllGodine');
    
    const headers = getAuthHeader();
    
    // Provjeri da li imamo token
    if (!headers.Authorization) {
      console.warn('[FRONTEND] Nema JWT tokena');
      return [];
    }
    
    const response = await axios.get(API_URL, { 
      headers,
      timeout: 10000
    });
    
    console.log('[FRONTEND] Odgovor od servera:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('[FRONTEND] Greška pri dohvaćanju godina:', error);
    
    // Detaljni debug
    if (error.response) {
      console.error('[FRONTEND] Server odgovor:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('[FRONTEND] Nema odgovora od servera:', error.request);
    } else {
      console.error('[FRONTEND] Greška u konfiguraciji:', error.message);
    }
    
    // Vrati prazan array za sad
    return [];
  }
};

// Ostale funkcije ostaju iste...
/*import axios from 'axios';

const API_URL = 'http://localhost:3000/api/godine';

// Pomoćna funkcija za dohvat tokena
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {};
};


export const getAllGodine = async () => {
  try {
    const headers = getAuthHeader();
    if (!headers.Authorization) return [];

    const response = await axios.get(API_URL, { headers });
    return response.data;
  } catch (error) {
    console.error('[SERVICE] Greška pri dohvaćanju godina:', error.message);
    return [];
  }
};*/

/**
 * Dohvaća zadnju otvorenu godinu sa servera
 */
export const getZadnjaGodina = async () => {
  try {
    const headers = getAuthHeader();
    const response = await axios.get(`${API_URL}/zadnja`, { headers });
    return response.data; // Očekuje se { zadnjaGodina: 2024 }
  } catch (error) {
    console.error('[SERVICE] Greška pri dohvaćanju zadnje godine:', error.message);
    throw error;
  }
};

/**
 * Otvara novu poslovnu godinu (Kopiranje podataka)
 */
export const otvoriGodinu = async (novaGodina) => {
  try {
    const headers = getAuthHeader();
    // Backend očekuje objekt { novaGodina: XXXX }
    const response = await axios.post(`${API_URL}/otvori`, { novaGodina }, { headers });
    return response.data;
  } catch (error) {
    console.error('[SERVICE] Greška pri otvaranju nove godine:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Briše/Resetira cijelu godinu
 */
// RESET/BRISANJE

export const deleteGodina = async (godinaZaReset) => {
  try {
    const token = localStorage.getItem('token');
    
    // VAŽNO: Koristimo .post i putanju /resetiraj
    // Šaljemo objekt { godina: 2026 } kao drugi parametar
    const response = await axios.post(
      `${API_URL}/resetiraj`, 
      { godina: godinaZaReset }, 
      { 
        headers: { Authorization: `Bearer ${token}` } 
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('[SERVICE] Greška pri resetiranju:', error);
    throw error;
  }
};