import { db } from "../config/db.js";

export const getAllNalozi = async () => {
  const [rows] = await db.query(`
    SELECT *
    FROM Nalog
    ORDER BY datum_nastanka DESC
  `);
  return rows;
};


export const getNalogById = async (id, page, limit) => {

  page = Number(page) || 1;
  limit = Number(limit) || 10;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit; 
  const [rows] = await db.query(
    `SELECT * FROM Nalog WHERE id = ? LIMIT ? OFFSET ?`,
    [id, limit, startIndex]
  );
  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM Nalog WHERE id = ?`,
    [id]
  );
  return {
    data: rows,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  } || null;
};

export const updateZatvoriNalog = async (nalog_id, korisnik_id) => {
  const [result] = await db.query(
    `
    UPDATE KorisnikNalog
    SET zatvoren = 1, datum_zatvaranja = NOW(), status = 'Zatvoren' 
    WHERE nalog_id = ? AND korisnik_id = ?
    `,
    [nalog_id, korisnik_id]
  );
  return result.affectedRows > 0;
};

export const getKorisnikNalogById = async (id, page, limit) => {

  page = Number(page) || 1;
  limit = Number(limit) || 10;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit; 
  const [rows] = await db.query(
  `
  SELECT
    n.id,
    n.naziv,
    n.rok_zavrsetka,
    n.sadrzaj,
    kn.status,
    kn.zatvoren,
    kn.datum_zatvaranja
  FROM KorisnikNalog kn
  JOIN Nalog n ON n.id = kn.nalog_id
  WHERE kn.korisnik_id = ?
  ORDER BY n.rok_zavrsetka ASC
  LIMIT ? OFFSET ?
  `,
  [id, limit, startIndex]
);

   const [[{ total }]] = await db.query(
  `
  SELECT COUNT(*) AS total
  FROM KorisnikNalog kn
  JOIN Nalog n ON n.id = kn.nalog_id
  WHERE kn.korisnik_id = ?
  `,
  [id]
);
  return {
    data: rows,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

/*export const getNaloziByYear = async (page, limit) => {
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
};*/

export const getNaloziByYear = async (page, limit) => {
  const now = new Date();
  const godina_oznaka = getAcademicYearStart(now);

  page = Number(page) || 1;
  limit = Number(limit) || 10;

  const offset = (page - 1) * limit;

  const [rows] = await db.query(
    `
    SELECT
  n.id AS nalog_id,
  n.naziv,
  n.rok_zavrsetka,
  n.sadrzaj,
  n.godina_oznaka,

  kn.korisnik_id,
  kn.status,
  kn.zatvoren,
  kn.datum_zatvaranja,

  k.email
  FROM KorisnikNalog kn
  JOIN Nalog n ON n.id = kn.nalog_id
  JOIN Korisnik k ON k.id = kn.korisnik_id
  WHERE n.godina_oznaka = ?
  ORDER BY n.rok_zavrsetka ASC
  LIMIT ? OFFSET ?
    `,
    [godina_oznaka, limit, offset]
  );

  const [[{ total }]] = await db.query(
    `
    SELECT COUNT(*) AS total
    FROM KorisnikNalog kn
    JOIN Nalog n ON n.id = kn.nalog_id
    WHERE n.godina_oznaka = ?
    `,
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
  
  const nalogId = result.insertId;

  const [users] = await db.query(
    `SELECT korisnik_id FROM KorisnikUloga WHERE uloga_id = ?`,
    [uloga_id]
  );

  if (users.length > 0) {
    const insertValues = users.map(u => [u.korisnik_id, nalogId, "Otvoren", 0, null]);

    await db.query(
      `INSERT INTO KorisnikNalog 
        (korisnik_id, nalog_id, status, zatvoren, datum_zatvaranja)
       VALUES ?`,
      [insertValues]
    );
  }

  return nalogId;
};



export const updateNalog = async (id, data) => {
  const {
    uloga_id,
    tip_naloga_id,
    naziv,
    sadrzaj,
    rok_zavrsetka,
    status,
  } = data;

  const now = new Date();
  const godina_oznaka = getAcademicYearStart(now);

 
  const [[oldNalog]] = await db.query(
    `SELECT uloga_id FROM Nalog WHERE id = ?`,
    [id]
  );

  if (!oldNalog) return false;

  const oldUlogaId = oldNalog.uloga_id;

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


  if (result.affectedRows === 0) return false;

  // 3️Ako se promijenio uloga_id → UPDATE KorisnikNalog
  if (uloga_id !== oldUlogaId) {
    console.log("Uloga se promijenila — radim reinsert korisnika...");

    // 3a) Dohvati korisnike s novom ulogom
    const [users] = await db.query(
      `SELECT korisnik_id FROM KorisnikUloga WHERE uloga_id = ?`,
      [uloga_id]
    );

    // 3b) Izbriši stare zapise iz KorisnikNalog za ovaj nalog
    await db.query(
      `DELETE FROM KorisnikNalog WHERE nalog_id = ?`,
      [id]
    );

    // 3c) Insertaj nove korisnike
    if (users.length > 0) {
      const insertValues = users.map(u => [
        u.korisnik_id,
        id,
        "Otvoren",   
        0,           
        null         
      ]);

      await db.query(
        `INSERT INTO KorisnikNalog 
          (korisnik_id, nalog_id, status, zatvoren, datum_zatvaranja)
         VALUES ?`,
        [insertValues]
      );
    }
  }

  return true;
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

export const getKasniNalozi = async (page, limit) => {
  const now = new Date();
  const godina_oznaka = getAcademicYearStart(now);

  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const offset = (page - 1) * limit;

  const [rows] = await db.query(
    `
    SELECT
      n.id AS nalog_id,
      n.naziv,
      n.rok_zavrsetka,
      n.sadrzaj,
      n.godina_oznaka,
      kn.korisnik_id,
      kn.status,
      kn.zatvoren,
      kn.datum_zatvaranja,
      k.email
    FROM KorisnikNalog kn
    JOIN Nalog n ON n.id = kn.nalog_id
    JOIN Korisnik k ON k.id = kn.korisnik_id
    WHERE n.godina_oznaka = ?
      AND kn.status = 'Otvoren'
      AND n.rok_zavrsetka < NOW()
    ORDER BY n.rok_zavrsetka ASC
    LIMIT ? OFFSET ?
    `,
    [godina_oznaka, limit, offset]
  );

  const [[{ total }]] = await db.query(
    `
    SELECT COUNT(*) AS total
    FROM KorisnikNalog kn
    JOIN Nalog n ON n.id = kn.nalog_id
    WHERE n.godina_oznaka = ?
      AND kn.status = 'Otvoren'
      AND n.rok_zavrsetka < NOW()
    `,
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

export const getZavrseniKasnjenje = async (page = 1, limit = 10) => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;

  const offset = (page - 1) * limit;

  const [rows] = await db.query(
    `
    SELECT
      n.id AS nalog_id,
      n.naziv,
      n.rok_zavrsetka,
      n.sadrzaj,
      kn.korisnik_id,
      kn.status,
      kn.zatvoren,
      kn.datum_zatvaranja,
      k.email
    FROM KorisnikNalog kn
    JOIN Nalog n ON n.id = kn.nalog_id
    JOIN Korisnik k ON k.id = kn.korisnik_id
    WHERE kn.datum_zatvaranja IS NOT NULL
      AND DATE(kn.datum_zatvaranja) > n.rok_zavrsetka
    ORDER BY kn.datum_zatvaranja DESC
    LIMIT ? OFFSET ?
    `,
    [limit, offset]
  );

  const [[{ total }]] = await db.query(
    `
    SELECT COUNT(*) AS total
    FROM KorisnikNalog kn
    JOIN Nalog n ON n.id = kn.nalog_id
    WHERE kn.datum_zatvaranja IS NOT NULL
      AND DATE(kn.datum_zatvaranja) > n.rok_zavrsetka
    `,
  );

  return {
    data: rows,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export const getZavrseniKasniZaExport = async () => {
  const [rows] = await db.query(`
    SELECT
      n.naziv,
      n.rok_zavrsetka,
      kn.datum_zatvaranja,
      kn.status,
      k.email
    FROM KorisnikNalog kn
    JOIN Nalog n ON n.id = kn.nalog_id
    JOIN Korisnik k ON k.id = kn.korisnik_id
    WHERE kn.datum_zatvaranja IS NOT NULL
      AND DATE(kn.datum_zatvaranja) > n.rok_zavrsetka
    ORDER BY kn.datum_zatvaranja DESC
  `);

  return rows;
};

export const getKasniNaloziZaExport = async () => {
  const now = new Date();
  const godina_oznaka = getAcademicYearStart(now);

  const [rows] = await db.query(
    `
    SELECT
      n.id AS nalog_id,
      n.naziv,
      n.rok_zavrsetka,
      n.sadrzaj,
      n.godina_oznaka,

      kn.korisnik_id,
      kn.status,
      kn.zatvoren,
      kn.datum_zatvaranja,

      k.email
    FROM KorisnikNalog kn
    JOIN Nalog n ON n.id = kn.nalog_id
    JOIN Korisnik k ON k.id = kn.korisnik_id
    WHERE n.godina_oznaka = ?
      AND kn.status = 'Otvoren'
      AND n.rok_zavrsetka < NOW()
    ORDER BY n.rok_zavrsetka ASC
    `,
    [godina_oznaka]
  );

  return rows;
};

