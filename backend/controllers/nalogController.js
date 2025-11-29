import * as nalogService from "../services/nalogService.js";

export const getAllNalozi = async (req, res) => {
  try {
    const nalozi = await nalogService.getAllNalozi();
    res.json(nalozi);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška na serveru" });
  }
};

export const getNalogById = async (req, res) => {
  try {
    const nalog = await nalogService.getNalogById(req.params.id);
    if (!nalog) return res.status(404).json({ error: "Nalog nije pronađen" });
    res.json(nalog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška na serveru" });
  }
};

// POST /api/nalozi/novi
export const createNalog = async (req, res) => {
  try {
    const newId = await nalogService.createNalog(req.body);
    res.status(201).json({ id: newId, poruka: "Nalog uspješno kreiran" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri kreiranju naloga" });
  }
};

export const getNaloziByYear = async (req, res) => {
  try {
    const year = req.params.year;
    const nalozi = await nalogService.getNaloziByYear(year);
    res.json(nalozi);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška na serveru" });
  }
};

export const getNadolazeciNalozi = async (req, res) => {
  try {
    const dani = parseInt(req.query.dani);

    if (isNaN(dani) || dani <= 0) {
      return res.status(400).json({ error: "Parametar 'dani' mora biti broj > 0" });
    }

    const nalozi = await nalogService.getNadolazeciNalozi(dani);

     if (nalozi.length === 0) {
      return res.status(404).json({ error: "Nema naloga u zadanom razdoblju" });
    }
    res.json(nalozi);
    

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška na serveru" });
  }
};

export const getTipoviNaloga = async (req, res) => {
  try {
    const tipovi = await nalogService.getAllTipoviNaloga()
    res.json(tipovi)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Greška na serveru' })
  }
};

export const getUloge = async (req, res) => {
  try {
    const uloge = await nalogService.getAllUloge()
    res.json(uloge)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Greška na serveru' })
  }
};