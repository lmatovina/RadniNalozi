import { db } from "../config/db.js";
// Uvoz korisnikService.js je ovdje bio pogrešno predložen, nije potreban za ovu logiku.

/**
 * Kreira novu ulogu i povezuje ju s odabranim korisnicima.
 * Koristi transakciju da bi osigurao atomičnost operacija.
 * * @param {string} naziv
 * @param {string} opis
 * @param {number} kreirao_korisnik_id - ID supervizora koji kreira ulogu
 * @param {number[]} korisnikIds - Array ID-eva korisnika za dodjelu uloge
 * @returns {object} Kreirana uloga
 */
export const createUlogaAndAssignUsers = async (naziv, opis, kreirao_korisnik_id, korisnikIds) => {
    let connection;
    try {
        // 1. POČETAK TRANSAKCIJE
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 2. Kreiranje uloge (INSERT INTO Uloga)
        const [result] = await connection.query(
            "INSERT INTO Uloga (naziv, opis, kreirao_korisnik_id) VALUES (?, ?, ?)",
            [naziv, opis, kreirao_korisnik_id]
        );

        const ulogaId = result.insertId;

        // 3. Povezivanje korisnika s ulogom (INSERT INTO KorisnikUloga)
        if (korisnikIds && korisnikIds.length > 0) {
            // Priprema vrijednosti za batch INSERT u spojnu tablicu
            const values = korisnikIds.map(userId => [userId, ulogaId]);
            
            // Koristi se format: INSERT INTO KorisnikUloga (...) VALUES (1, 5), (2, 5), ...
            await connection.query(
                "INSERT INTO KorisnikUloga (korisnik_id, uloga_id) VALUES ?",
                [values] // MySQL driver automatski rukuje formatiranjem arraya u query
            );
        }

        // 4. COMMIT TRANSAKCIJE (Potvrda promjena)
        await connection.commit();

        // Dohvaćanje i vraćanje kreirane uloge
        const [uloge] = await db.query("SELECT * FROM Uloga WHERE id = ?", [ulogaId]);
        
        return uloge[0];

    } catch (error) {
        if (connection) {
            await connection.rollback(); // Vraćanje stanja u slučaju greške
        }
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

/**
 * Dohvaća sve postojeće uloge.
 */
export const getAllUloge = async () => {
    // NAPOMENA: Za brzi dohvat samo osnovnih podataka
    // Ako želite i broj članova, trebali biste koristiti JOIN ili podupit u SQL-u.
    const [uloge] = await db.query("SELECT * FROM Uloga ORDER BY naziv");
    return uloge;
};

/**
 * Uklanja korisnika iz određene uloge (Briše red iz KorisnikUloga).
 */
export const removeMemberFromUloga = async (ulogaId, korisnikId) => {
    const [result] = await db.query(
        "DELETE FROM KorisnikUloga WHERE uloga_id = ? AND korisnik_id = ?",
        [ulogaId, korisnikId]
    );
    // Vraća true ako je promijenjen barem jedan red
    return result.affectedRows > 0; 
};


/**
 * Dohvaća detalje korisnika koji su članovi određene uloge.
 * @param {number} ulogaId - ID uloge.
 * @returns {Array} Lista objekata Korisnika.
 */
export const getMembersByUlogaId = async (ulogaId) => {
    // SELECT: Dohvaćamo id, ime, prezime i email iz tablice Korisnik
    // JOIN: Spajamo s KorisnikUloga gdje je uloga_id = :ulogaId
    const query = `
        SELECT 
            K.id, 
            K.ime, 
            K.prezime, 
            K.email 
        FROM Korisnik K
        JOIN KorisnikUloga KU ON K.id = KU.korisnik_id
        WHERE KU.uloga_id = ?
        ORDER BY K.prezime, K.ime`;
    
    const [members] = await db.query(query, [ulogaId]);
    return members;
};



export const deleteUloga = async (ulogaId) => {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Prvo obrišite sve članove iz uloge (iz spojne tablice)
        await connection.query(
            "DELETE FROM KorisnikUloga WHERE uloga_id = ?",
            [ulogaId]
        );

        // 2. Zatim obrišite samu ulogu
        const [result] = await connection.query(
            "DELETE FROM Uloga WHERE id = ?",
            [ulogaId]
        );

        await connection.commit();

        // Vraća true ako je obrisan barem jedan red
        return result.affectedRows > 0;

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

export const addUsersToUloga = async (ulogaId, korisnikIds) => {
    let connection;

    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        
        const [existing] = await connection.query(
            "SELECT korisnik_id FROM KorisnikUloga WHERE uloga_id = ?",
            [ulogaId]
        );

        const existingIds = existing.map(r => r.korisnik_id);

       
        const newUserIds = korisnikIds.filter(
            id => !existingIds.includes(id)
        );

        if (newUserIds.length === 0) {
            await connection.commit();
            return { added: 0 };
        }

        
        const values = newUserIds.map(userId => [userId, ulogaId]);

        await connection.query(
            "INSERT INTO KorisnikUloga (korisnik_id, uloga_id) VALUES ?",
            [values]
        );

        await connection.commit();

        return { added: newUserIds.length };

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

export const addUsersToUlogaAndAssignNaloge = async (ulogaId, korisnikIds) => {
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // 1. Dohvati postojeće korisnike u ulozi
    const [existingUsers] = await connection.query(
      `SELECT korisnik_id FROM KorisnikUloga WHERE uloga_id = ?`,
      [ulogaId]
    );

    const existingUserIds = existingUsers.map(u => u.korisnik_id);

    // 2. Samo NOVI korisnici
    const newUserIds = korisnikIds.filter(
      id => !existingUserIds.includes(id)
    );

    if (newUserIds.length === 0) {
      await connection.commit();
      return { addedUsers: 0, assignedNalogs: 0 };
    }

    // 3. Insert u KorisnikUloga
    const userRoleValues = newUserIds.map(uid => [uid, ulogaId]);

    await connection.query(
      `INSERT INTO KorisnikUloga (korisnik_id, uloga_id) VALUES ?`,
      [userRoleValues]
    );

    // 4. Dohvati sve naloge te uloge
    const [nalogs] = await connection.query(
      `SELECT id FROM Nalog WHERE uloga_id = ?`,
      [ulogaId]
    );

    if (nalogs.length > 0) {
      const nalogAssignments = [];

      for (const nalog of nalogs) {
        for (const userId of newUserIds) {
          nalogAssignments.push([
            userId,
            nalog.id,
            "Otvoren",
            0,
            null
          ]);
        }
      }

      // 5. Insert u KorisnikNalog
      await connection.query(
        `INSERT INTO KorisnikNalog
          (korisnik_id, nalog_id, status, zatvoren, datum_zatvaranja)
         VALUES ?`,
        [nalogAssignments]
      );
    }

    await connection.commit();

    return {
      addedUsers: newUserIds.length,
      assignedNalogs: nalogs.length
    };

  } catch (error) {
    if (connection) await connection.rollback();
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

export const removeUserFromUlogaAndNaloge = async (ulogaId, korisnikId) => {
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // 1. Obriši vezu korisnik–uloga
    await connection.query(
      `DELETE FROM KorisnikUloga 
       WHERE korisnik_id = ? AND uloga_id = ?`,
      [korisnikId, ulogaId]
    );

    // 2. Obriši sve naloge tog korisnika za tu ulogu
    await connection.query(
      `
      DELETE kn
      FROM KorisnikNalog kn
      JOIN Nalog n ON n.id = kn.nalog_id
      WHERE kn.korisnik_id = ?
        AND n.uloga_id = ?
      `,
      [korisnikId, ulogaId]
    );

    await connection.commit();
    return true;

  } catch (error) {
    if (connection) await connection.rollback();
    throw error;
  } finally {
    if (connection) connection.release();
  }
};
