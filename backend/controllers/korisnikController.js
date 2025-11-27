// controllers/korisnikController.js
import * as korisnikService from "../services/korisnikService.js";
// Pretpostavljam da imate bcrypt ili sličnu biblioteku za hashiranje
import bcrypt from "bcrypt";

// Dobro je definirati faktor za hashiranje
const saltRounds = 12;

export const getAllKorisnici = async (req, res) => {
  try {
    const korisnici = await korisnikService.getAllKorisnici();
    res.json(korisnici);
  } catch (error) {
    console.error("Greška pri dohvaćanju korisnika:", error);
    res.status(500).json({ error: "Interna greška servera" });
  }
};

export const updateSupervizorStatus = async (req, res) => {
  const { id } = req.params;
  const { je_supervizor } = req.body;

  // Osiguravamo da je 'je_supervizor' boolean ili 0/1
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
    // 1. Hashiranje lozinke
    const lozinka_hash = await bcrypt.hash(lozinka, saltRounds);

    // 2. Kreiranje korisnika
    const newId = await korisnikService.createKorisnik(
      ime,
      prezime,
      email,
      lozinka_hash,
      je_supervizor ? 1 : 0 // Osiguravamo 0 ili 1 za bazu
    );

    // 3. Vraćamo novog korisnika (bez hash-a)
    res.status(201).json({ 
        id: newId, 
        ime, 
        prezime, 
        email, 
        je_supervizor: je_supervizor ? 1 : 0, 
        message: "Korisnik uspješno kreiran." 
    });
  } catch (error) {
    // Provjera ako je greška zbog jedinstvenosti emaila (ovisno o db driveru)
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: "Korisnik s tim emailom već postoji." });
    }
    console.error("Greška pri kreiranju korisnika:", error);
    res.status(500).json({ error: "Interna greška servera." });
  }
};