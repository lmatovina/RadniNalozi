import * as nalogService from "../services/nalogService.js";
import ExcelJS from "exceljs";

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
    const page = parseInt(req.query.page, 10) || 1;      
    const limit = parseInt(req.query.limit, 10) || 10; 

    const nalog = await nalogService.getNalogById(req.params.id, page, limit);
    if (!nalog) return res.status(404).json({ error: "Nalog nije pronađen" });
    res.json(nalog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška na serveru" });
  }
};

export const getKorisnikNalogById = async (req, res) => {
  try {
    const { korisnikId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;      
    const limit = parseInt(req.query.limit, 10) || 10; 

    const nalog = await nalogService.getKorisnikNalogById(korisnikId, page, limit);
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

/*export const getNaloziByYear = async (req, res) => {
  try {
    const year = req.params.year;
    const nalozi = await nalogService.getNaloziByYear(year);
    res.json(nalozi);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška na serveru" });
  }
};*/
export const getNaloziByYear = async (req, res) => {
  try {
    console.log("Query params:", req.query);
    const page = parseInt(req.query.page, 10) || 1;      
    const limit = parseInt(req.query.limit, 10) || 10; 

    const nalozi = await nalogService.getNaloziByYear(page, limit);

    res.json(nalozi);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška na serveru" });
  }
};

export const getNadolazeciNalozi = async (req, res) => {
  try {
    const dani = parseInt(req.query.dani);
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    if (isNaN(dani) || dani <= 0) {
      return res.status(400).json({ error: "Parametar 'dani' mora biti broj > 0" });
    }

    const result = await nalogService.getNadolazeciNalozi(dani, page, limit);

    res.json(result);

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

export const createTipNaloga = async (req, res) => {
  try {
    const result = await nalogService.createTipNaloga(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTipNaloga = async (req, res) => {
  try {
    const result = await nalogService.updateTipNaloga(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTipNaloga = async (req, res) => {
  try {
    await nalogService.deleteTipNaloga(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

export const updateZatvoriNalog = async (req, res) => {
  try {
      console.log("REQ.USER:", req.user);
  console.log("PARAMS ID:", req.params.id);
    const { id } = req.params; 
    const korisnik_id = req.user.id; 
    console.log("Korisnik ID:", korisnik_id);

    const success = await nalogService.updateZatvoriNalog(id, korisnik_id);

    if (!success) {
      return res.status(404).json({ error: "Nalog nije pronađen ili već zatvoren" });
    }

    res.json({ message: "Nalog zatvoren" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška na serveru" });
  }
};

export const getKasniNalozi = async (req, res) => {
  try {
    console.log("Query params:", req.query);
    const page = parseInt(req.query.page, 10) || 1;      
    const limit = parseInt(req.query.limit, 10) || 10; 

    const nalozi = await nalogService.getKasniNalozi(page, limit);

    res.json(nalozi);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška na serveru" });
  }
};

export const getZavrseniKasnjenje = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const nalozi = await nalogService.getZavrseniKasnjenje(page, limit);

    res.json(nalozi);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška na serveru" });
  }
};

export const exportZavrseniKasniExcel = async (req, res) => {
  const data = await nalogService.getZavrseniKasniZaExport();

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Završeni s kašnjenjem");

  sheet.columns = [
    { header: "Naziv", key: "naziv", width: 30 },
    { header: "Email", key: "email", width: 30 },
    { header: "Rok završetka", key: "rok_zavrsetka", width: 15 },
    { header: "Datum zatvaranja", key: "datum_zatvaranja", width: 20 },
    { header: "Status", key: "status", width: 15 },
  ];

  sheet.addRows(data);

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=zavrseni_kasni.xlsx"
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  await workbook.xlsx.write(res);
  res.end();
};

export const exportKasniNaloziExcel = async (req, res) => {
  try {
    const data = await nalogService.getKasniNaloziZaExport();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Kasni nalozi");

    worksheet.columns = [
      { header: "Nalog ID", key: "nalog_id", width: 10 },
      { header: "Naziv", key: "naziv", width: 25 },
      { header: "Rok završetka", key: "rok_zavrsetka", width: 15 },
      { header: "Status", key: "status", width: 12 },
      { header: "Email korisnika", key: "email", width: 30 },
      { header: "Sadržaj", key: "sadrzaj", width: 40 },
    ];

    data.forEach(row => {
      worksheet.addRow({
        nalog_id: row.nalog_id,
        naziv: row.naziv,
        rok_zavrsetka: row.rok_zavrsetka,
        status: row.status,
        email: row.email,
        sadrzaj: row.sadrzaj
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=kasni_nalozi.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri exportu kasnih naloga" });
  }
};

export const updateNalog = async (req, res) => {
  try {
    const ok = await nalogService.updateNalog(req.params.id, req.body);
    if (!ok) return res.status(404).json({ message: "Nalog nije pronađen" });

    return res.json({ message: "Nalog uspješno ažuriran" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Greška servera" });
  }
};


export const handleEmailClosure = async (req, res) => {
    const { id } = req.params;
    const { confirmed } = req.query; // Gledamo je li korisnik potvrdio

    // Ako korisnik još NIJE potvrdio, pošalji mu stranicu za potvrdu
    if (confirmed !== 'true') {
        return res.send(`
            <div style="text-align:center; font-family:sans-serif; margin-top:100px; padding: 20px;">
                <h2 style="color: #333;">Potvrda zatvaranja naloga</h2>
                <p>Jeste li sigurni da želite zatvoriti nalog <strong>#${id}</strong>?</p>
                <br>
                <a href="/api/nalozi/zatvori-direktno/${id}?confirmed=true" 
                   style="background-color: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 10px;">
                   Da, zatvori nalog
                </a>
                <a href="#" onclick="window.close(); return false;" 
                   style="background-color: #6c757d; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                   Odustani
                </a>
            </div>
        `);
    }

    // Ako je confirmed === 'true', onda radimo stvarno zatvaranje
    try {
        const success = await nalogService.closeNalogById(id);

        if (success) {
            res.send(`
                <div style="text-align:center; font-family:sans-serif; margin-top:100px;">
                    <h2 style="color: #28a745;">Uspješno!</h2>
                    <p>Nalog #${id} je sada službeno <strong>Zatvoren</strong>.</p>
                    <p style="color: #666; font-size: 0.9em;">Možete zatvoriti ovaj prozor.</p>
                </div>
            `);
        } else {
            res.status(404).send('Nalog nije pronađen ili je već zatvoren.');
        }
    } catch (error) {
        res.status(500).send('Greška na serveru prilikom zatvaranja.');
    }
};