import { db } from "../config/db.js";

export const getAllNalozi = async () => {
  const [rows] = await db.query(`
    SELECT *
    FROM Nalog
    ORDER BY datum_nastanka DESC
  `);
  return rows;
};

export const getNalogById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM Nalog WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
};

export const getNaloziByYear = async (year) => {
  const [rows] = await db.query(
    `SELECT * FROM Nalog WHERE godina_oznaka = ? ORDER BY datum_nastanka DESC`,
    [year]
  );
  return rows;
};

export const getNadolazeciNalozi = async (dani) => {
  const [rows] = await db.query(
    `
      SELECT *
      FROM Nalog
      WHERE rok_zavrsetka BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL ? DAY)
      ORDER BY rok_zavrsetka ASC
    `,
    [dani]
  );

  return rows;
};
/*
export const createNalog = async (data) => {
  const {
    uloga_id,
    tip_naloga_id,
    kreirao_korisnik_id,
    naziv,
    sadrzaj,
    rok_zavrsetka,
    godina_oznaka,
  } = data;

  const [result] = await db.query(
    `
    INSERT INTO Nalog 
      (uloga_id, tip_naloga_id, kreirao_korisnik_id, naziv, sadrzaj, rok_zavrsetka, godina_oznaka)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
    [
      uloga_id,
      tip_naloga_id,
      kreirao_korisnik_id,
      naziv,
      sadrzaj,
      rok_zavrsetka,
      godina_oznaka,
    ]
  );

  return result.insertId;
};*/
