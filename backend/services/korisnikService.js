// service/korisnikService.js
import { db } from "../config/db.js";

/**
 * Dohvaća korisnike filtrirane po imenu/prezimenu/emailu.
 * @param {string} searchQuery - Tekst za pretragu.
 * @returns {Array} Lista korisnika.
 */
export const searchKorisnici = async (searchQuery) => {
    let query = "SELECT id, ime, prezime, email FROM Korisnik";
    let params = [];

    if (searchQuery && searchQuery.length >= 2) {
        // Pretraga po imenu ILI prezimenu ILI emailu
        const searchPattern = `%${searchQuery}%`;
        query += " WHERE ime LIKE ? OR prezime LIKE ? OR email LIKE ?";
        params.push(searchPattern, searchPattern, searchPattern);
    }
    
    // Sortiranje da bi rezultati bili konzistentni
    query += " ORDER BY prezime, ime LIMIT 50"; 

    const [korisnici] = await db.query(query, params);
    return korisnici;
};

/**
 * Dohvaća sve korisnike s odabranim atributima.
 * Uklanjamo 'lozinka_hash' iz sigurnosnih razloga.
 */
export const getAllKorisnici = async (page, limit) => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const startIndex = (page - 1) * limit;
  const endInedx = page * limit;
  const [rows] = await db.query(`
    SELECT id, ime, prezime, email, je_supervizor
    FROM Korisnik
    ORDER BY prezime, ime LIMIT ? OFFSET ?`,
  [limit, startIndex]);

   const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM Korisnik`);

  return {
    data: rows,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Ažurira status 'je_supervizor' za određenog korisnika.
 */
export const updateKorisnikSupervizorStatus = async (id, je_supervizor) => {
  const [result] = await db.query(
    `
    UPDATE Korisnik
    SET je_supervizor = ?
    WHERE id = ?
    `,
    [je_supervizor, id]
  );
  return result.affectedRows > 0;
};


export const createKorisnik = async (ime, prezime, email, lozinka_hash, je_supervizor) => {
  const [result] = await db.query(
    `
    INSERT INTO Korisnik (ime, prezime, email, lozinka_hash, je_supervizor)
    VALUES (?, ?, ?, ?, ?)
    `,
    [ime, prezime, email, lozinka_hash, je_supervizor]
  );
  return result.insertId;
};