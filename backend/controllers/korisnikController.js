
import * as korisnikService from "../services/korisnikService.js";
import bcrypt from "bcrypt";

const saltRounds = 12;

export const getAllKorisnici = async (req, res) => {
  try {
    console.log("Query params:", req.query);
    const page = parseInt(req.query.page, 10) || 1;      
    const limit = parseInt(req.query.limit, 10) || 10; 
    const korisnici = await korisnikService.getAllKorisnici(page, limit);
    res.json(korisnici);
  } catch (error) {
    console.error("Greška pri dohvaćanju korisnika:", error);
    res.status(500).json({ error: "Interna greška servera" });
  }
};

export const searchKorisnici = async (req, res) => {
    try {
        const { q } = req.query;
        
        console.log("🔍 Pretraga korisnika za termin:", q);
        
        if (!q || q.length < 2) {
            return res.json([]); // Vraća prazan array umjesto greške
        }
        
        const korisnici = await korisnikService.searchKorisnici(q);
        res.json(korisnici);
    } catch (error) {
        console.error("Greška pri pretrazi korisnika:", error);
        res.status(500).json({ error: "Interna greška servera" });
    }
};

/**
 * Dohvaća listu korisnika s opcionalnim filtrom pretrage.
 * Pristupa se preko GET /api/korisnici?search=termin
 */
/*export const getFilteredKorisnici = async (req, res) => {
    try {
        const { search } = req.query; // Dohvaćanje search parametra
        const korisnici = await korisnikService.searchKorisnici(search);
        res.json(korisnici);
    } catch (error) {
        console.error("Greška pri dohvaćanju filtriranih korisnika:", error);
        res.status(500).json({ error: "Interna greška servera" });
    }
};*/

export const updateSupervizorStatus = async (req, res) => {
  const { id } = req.params;
  const { je_supervizor } = req.body;


  const status = je_supervizor ? 1 : 0;

  try {
    const success = await korisnikService.updateKorisnikSupervizorStatus(id, status);
    if (success) {
      res.json({ message: `Status korisnika ID ${id} uspješno ažuriran.` });
    } else {
      res.status(404).json({ error: "Korisnik nije pronađen ili nema promjena." });
    }
  } catch (error) {
    console.error("Greška pri ažuriranju statusa:", error);
    res.status(500).json({ error: "Interna greška servera" });
  }
};

export const createKorisnik = async (req, res) => {
  const { ime, prezime, email, lozinka, je_supervizor } = req.body;

  if (!ime || !prezime || !email || !lozinka) {
    return res.status(400).json({ error: "Nedostaju obavezni podaci (ime, prezime, email, lozinka)." });
  }

  try {
    
    const lozinka_hash = await bcrypt.hash(lozinka, saltRounds);

    
    const newId = await korisnikService.createKorisnik(
      ime,
      prezime,
      email,
      lozinka_hash,
      je_supervizor ? 1 : 0 
    );

    
    res.status(201).json({ 
        id: newId, 
        ime, 
        prezime, 
        email, 
        je_supervizor: je_supervizor ? 1 : 0, 
        message: "Korisnik uspješno kreiran." 
    });
  } catch (error) {
    
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: "Korisnik s tim emailom već postoji." });
    }
    console.error("Greška pri kreiranju korisnika:", error);
    res.status(500).json({ error: "Interna greška servera." });
  }
};

export const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      error: "Trenutna i nova lozinka su obavezne."
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      error: "Nova lozinka mora imati barem 8 znakova."
    });
  }

  try {
    const user = await korisnikService.getUserPasswordHash(userId);

    if (!user) {
      return res.status(404).json({ error: "Korisnik ne postoji." });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.lozinka_hash
    );

    if (!isMatch) {
      return res.status(401).json({
        error: "Trenutna lozinka nije ispravna."
      });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await korisnikService.updateUserPassword(userId, newHash);

    res.status(200).json({
      message: "Lozinka uspješno promijenjena."
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška na serveru." });
  }
};


