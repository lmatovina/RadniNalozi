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

export const getNaloziByYear = async (page, limit) => {
  const now = new Date();
  const godina_oznaka = getAcademicYearStart(now);
  page = Number(page) || 1;
  limit = Number(limit) || 2;

  const startIndex = (page - 1) * limit;
  const endInedx = page * limit;
  const [rows] = await db.query(
    `SELECT * FROM Nalog WHERE godina_oznaka = ? ORDER BY datum_nastanka DESC LIMIT ? OFFSET ? `,
    [godina_oznaka, limit, startIndex]
  );
  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM Nalog WHERE godina_oznaka = ?`,
    [godina_oznaka]
  );
  return {
    data: rows,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export const getNadolazeciNalozi = async (dani, page, limit) => {

  page = Number(page) || 1;
  limit = Number(limit) || 2;

  const startIndex = (page - 1) * limit;
  const endInedx = page * limit;
  const [rows] = await db.query(
    `
      SELECT *
      FROM Nalog
      WHERE rok_zavrsetka BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL ? DAY)
      ORDER BY rok_zavrsetka ASC LIMIT ? OFFSET ?
    `,
    [dani, limit, startIndex]
  );

  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM Nalog WHERE rok_zavrsetka BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL ? DAY)`,
    [dani]
  );
  
  return {
    data: rows,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

function getAcademicYearStart(date) {
  const d = new Date(date);
  const m = d.getMonth() + 1;
  const y = d.getFullYear();
  return m >= 10 ? y : y - 1;
}


export const createNalog = async (data) => {
  console.log('=== CREATE NALOG DATA ===', JSON.stringify(data, null, 2));
  
  
  const {
    uloga_id,
    tip_naloga_id,
    kreirao_korisnik_id,
    naziv,
    sadrzaj,
    rok_zavrsetka,
  } = data;
   const now = new Date();
  const godina_oznaka = getAcademicYearStart(now);

  console.log('=== RAZBJEŽENA DATA ===', {uloga_id, tip_naloga_id, kreirao_korisnik_id, naziv,godina_oznaka });
  
  const values = [uloga_id, tip_naloga_id || null, kreirao_korisnik_id, naziv, sadrzaj, rok_zavrsetka, godina_oznaka];
  console.log('=== VALUES ARRAY ===', values);
  console.log(new Date("2022-10-20"));
  const [result] = await db.query(
    `INSERT INTO Nalog (uloga_id, tip_naloga_id, kreirao_korisnik_id, naziv, sadrzaj, rok_zavrsetka, godina_oznaka) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    values
  );
  
  return result.insertId;
};



export const updateNalog = async (id, data) => {
  const {
    uloga_id,
    tip_naloga_id,
    naziv,
    sadrzaj,
    rok_zavrsetka,
    godina_oznaka,
    status, // opcionalno
  } = data;

  const [result] = await db.query(
    `
    UPDATE Nalog
    SET
      uloga_id = ?,
      tip_naloga_id = ?,
      naziv = ?,
      sadrzaj = ?,
      rok_zavrsetka = ?,
      godina_oznaka = ?,
      status = COALESCE(?, status)
    WHERE id = ?
    `,
    [
      uloga_id,
      tip_naloga_id || null,
      naziv,
      sadrzaj,
      rok_zavrsetka,
      godina_oznaka,
      status || null,
      id,
    ]
  );

  return result.affectedRows > 0;
};

export const deleteNalog = async (id) => {
  const [result] = await db.query(
    `DELETE FROM Nalog WHERE id = ?`,
    [id]
  );
  return result.affectedRows > 0;
};

export const getAllTipoviNaloga = async () => {
  const [rows] = await db.query(`
    SELECT id, naziv
    FROM TipNaloga
    ORDER BY naziv
  `)
  return rows
}

export const getAllUloge = async () => {
  const [rows] = await db.query(`
    SELECT id, naziv
    FROM Uloga
    ORDER BY naziv
  `)
  return rows
}
