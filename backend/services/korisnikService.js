// service/korisnikService.js
import { db } from "../config/db.js";

/**
 * Dohvaća sve korisnike s odabranim atributima.
 * Uklanjamo 'lozinka_hash' iz sigurnosnih razloga.
 */
export const getAllKorisnici = async () => {
  const [rows] = await db.query(`
    SELECT id, ime, prezime, email, je_supervizor
    FROM Korisnik
    ORDER BY prezime, ime
  `);
  return rows;
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

/**
 * Kreira novog korisnika.
 * U stvarnoj aplikaciji, lozinka bi se hashirala prije slanja u bazu.
 * Pretpostavljam da se hashiranje događa na razini kontrolera ili prije poziva ove funkcije.
 * Ovdje koristim placeholder 'lozinka_hash'.
 */
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