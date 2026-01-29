import { db } from "../config/db.js";

export const getAllGodine = async () => {
    const [result] = await db.query(`
        SELECT DISTINCT godina_oznaka as godina FROM Nalog ORDER BY godina_oznaka DESC
    `);
    return result.map(row => row.godina);
};

export const getLastOpenedYear = async () => {
    const [result] = await db.query(`SELECT MAX(godina_oznaka) as zadnja FROM Nalog`);
    return result[0]?.zadnja || null;
};






export const openNewYear = async (novaGodina, createdByUserId, izvornaGodina) => {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Koristi godinu koju je korisnik odabrao u UI-u ili zadnju dostupnu
        const sourceYear = izvornaGodina || (await getLastOpenedYear());

        const [stariNalozi] = await connection.query(
            "SELECT * FROM Nalog WHERE godina_oznaka = ?", [sourceYear]
        );

        for (const nalog of stariNalozi) {
            // Kopiranje Naloga
            const [resNalog] = await connection.query(`
                INSERT INTO Nalog (uloga_id, tip_naloga_id, kreirao_korisnik_id, naziv, sadrzaj, 
                                   rok_zavrsetka, godina_oznaka, status, datum_nastanka, datum_zadnje_izmene)
                VALUES (?, ?, ?, ?, ?, DATE_ADD(?, INTERVAL (? - ?) YEAR), ?, 'Otvoren', NOW(), NOW())
            `, [nalog.uloga_id, nalog.tip_naloga_id, createdByUserId, nalog.naziv, nalog.sadrzaj, 
                nalog.rok_zavrsetka, novaGodina, sourceYear, novaGodina]);

            const noviNalogId = resNalog.insertId;

            // Kopiranje KorisnikNalog (veze)
            const [stariKorisnici] = await connection.query(
                "SELECT korisnik_id FROM KorisnikNalog WHERE nalog_id = ?", [nalog.id]
            );

            for (const kor of stariKorisnici) {
                await connection.query(`
                        INSERT INTO KorisnikNalog (korisnik_id, nalog_id, zatvoren, status, godina)
                    VALUES (?, ?, 0, 'Otvoren', ?)
                `, [kor.korisnik_id, noviNalogId,  novaGodina]);
            }
        }

        await connection.commit();
        return { success: true, message: `Kopirano ${stariNalozi.length} naloga u ${novaGodina}. godinu.` };
    } catch (error) {
        if (connection) await connection.rollback();
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

export const deleteYearData = async (godina) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Čistimo tablice unutar transakcije
        await connection.query('DELETE FROM KorisnikNalog WHERE godina = ? OR godina IS NULL', [godina]);
        await connection.query('DELETE FROM Nalog WHERE godina_oznaka = ?', [godina]);

        await connection.commit();
        return { message: `Uspješno obrisani podaci za godinu ${godina}` };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};