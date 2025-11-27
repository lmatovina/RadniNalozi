// src/services/korisniciService.js

import axios from 'axios'

// ⚠️ Prilagodite API_URL ako Vam se backend ne nalazi na 3000 portu ili na 'api/korisnici'
const API_URL = 'http://localhost:3000/api/korisnici'

/**
 * Pomoćna funkcija za dohvaćanje JWT tokena iz LocalStorage-a
 * i formatiranje u standardni Authorization header.
 */
const getAuthHeader = () => {
  // Pretpostavlja se da se token zove 'token' u localStorage-u
  const token = localStorage.getItem('token') 
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// -----------------------------------------------------
// 1. DOHVAĆANJE (GET)
// -----------------------------------------------------

/**
 * Dohvaća listu svih korisnika.
 * @returns {Promise<Array>} Lista objekata korisnika
 */
export const getAllKorisnici = async () => {
  const res = await axios.get(`${API_URL}`, { headers: getAuthHeader() })
  return res.data
}


// -----------------------------------------------------
// 2. KREIRANJE (POST)
// -----------------------------------------------------

/**
 * Kreira novog korisnika.
 * @param {Object} korisnik - Objekt s ime, prezime, email, lozinka, je_supervizor
 * @returns {Promise<Object>} Kreirani korisnik (bez hashirane lozinke)
 */
export const createKorisnik = async (korisnik) => {
  const res = await axios.post(API_URL, korisnik, { headers: getAuthHeader() })
  return res.data
}


// -----------------------------------------------------
// 3. AŽURIRANJE (PATCH)
// -----------------------------------------------------

/**
 * Ažurira status 'je_supervizor' za određenog korisnika.
 * @param {number} id - ID korisnika
 * @param {boolean} je_supervizor - Novi status (true ili false)
 * @returns {Promise<Object>} Poruka o uspjehu
 */
export const updateKorisnikSupervizorStatus = async (id, je_supervizor) => {
  const res = await axios.patch(
    `${API_URL}/${id}/supervizor`, 
    { je_supervizor: je_supervizor }, // Payload
    { headers: getAuthHeader() } // Header
  )
  return res.data
}