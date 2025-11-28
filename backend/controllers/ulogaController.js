import * as ulogaService from "../services/ulogaService.js";

/**
 * Dohvaća sve uloge.
 */
export const getAllUloge = async (req, res) => {
    try {
        const uloge = await ulogaService.getAllUloge();
        res.status(200).json(uloge);
    } catch (error) {
        console.error("Greška pri dohvaćanju uloga:", error);
        res.status(500).json({ error: "Interna greška servera" });
    }
};


/**
 * Kreira novu ulogu i dodjeljuje korisnike.
 * *NAPOMENA: Autorizacija (Supervizor) se provjerava u 'supervisorMiddleware'.
 */
export const createUloga = async (req, res) => {
    const { naziv, opis, korisnikIds } = req.body;

    // 1. Validacija obaveznih polja
    if (!naziv) {
        return res.status(400).json({ error: "Naziv uloge je obavezan." });
    }

    // ID supervizora dolazi iz dekodiranog JWT tokena postavljenog od strane authMiddleware
    const kreirao_korisnik_id = req.user.id; 

    try {
        // 2. Poziv servisnog sloja za kreiranje uloge i dodjelu korisnika (u transakciji)
        const novaUloga = await ulogaService.createUlogaAndAssignUsers(
            naziv,
            opis,
            kreirao_korisnik_id,
            korisnikIds
        );

        // 3. Uspješan odgovor
        res.status(201).json(novaUloga);

    } catch (error) {
        
        // 4. Rukovanje specifičnim greškama (npr. Duplikat unosa ako je naziv UNIQUE)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: "Uloga s tim nazivom već postoji." });
        }

        // 5. Opća greška servera
        console.error("Greška pri kreiranju uloge:", error);
        res.status(500).json({ error: "Interna greška servera." });
    }
};