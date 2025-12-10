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

/**
 * Uklanja korisnika iz uloge.
 */
export const removeMember = async (req, res) => {
    try {
        const { ulogaId, korisnikId } = req.params; // Dobivanje ID-eva iz URL-a
        
        // Samo supervizori mogu uklanjati članove, što osigurava supervisorMiddleware

        const success = await ulogaService.removeMemberFromUloga(ulogaId, korisnikId);
        
        if (success) {
            res.status(200).json({ message: "Član uspješno uklonjen iz uloge." });
        } else {
            res.status(404).json({ error: "Član ili uloga nije pronađena." });
        }

    } catch (error) {
        console.error("Greška pri uklanjanju člana iz uloge:", error);
        res.status(500).json({ error: "Interna greška servera." });
    }
};


/**
 * Dohvaća članove određene uloge.
 */
export const getUlogaMembers = async (req, res) => {
    try {
        const { id } = req.params; // Dobivanje ID uloge iz URL-a
        
        // Nije potrebna Supervizorska provjera, samo JWT autentikacija
        // jer svi logirani korisnici mogu vidjeti sastav tima

        const members = await ulogaService.getMembersByUlogaId(id);
        
        res.status(200).json(members);

    } catch (error) {
        console.error(`Greška pri dohvaćanju članova uloge ${req.params.id}:`, error);
        res.status(500).json({ error: "Interna greška servera prilikom dohvaćanja članova." });
    }
};

export const deleteUloga = async (req, res) => {
    const { id } = req.params;

    console.log(`Brisanje uloge ID: ${id}`);

    try {
        const success = await ulogaService.deleteUloga(id);
        
        if (success) {
            res.status(200).json({ 
                message: `Uloga ID ${id} uspješno obrisana.`,
                deleted: true 
            });
        } else {
            res.status(404).json({ 
                error: `Uloga ID ${id} nije pronađena.` 
            });
        }
    } catch (error) {
        console.error(`Greška pri brisanju uloge ${id}:`, error);
        
        if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ 
                error: "Ulogu se ne može obrisati jer je povezana s drugim zapisima." 
            });
        }
        
        res.status(500).json({ error: "Interna greška servera pri brisanju uloge." });
    }
};