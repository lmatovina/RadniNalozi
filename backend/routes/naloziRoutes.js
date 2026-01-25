import { Router } from "express";
import * as nalogController from "../controllers/nalogController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js"

const router = Router();

// --- POSTOJEĆE RUTE ---
router.get("/godina", authenticateJWT, nalogController.getNaloziByYear);
router.get("/kasni", authenticateJWT, nalogController.getKasniNalozi);
router.get("/zavrseni-kasni", authenticateJWT, nalogController.getZavrseniKasnjenje);
router.get("/nadolazeci", authenticateJWT, nalogController.getNadolazeciNalozi);
router.get("/naziviUloga", authenticateJWT, nalogController.getUloge);
router.get("/export/zavrseni-kasni", authenticateJWT, nalogController.exportZavrseniKasniExcel);
router.get("/export/kasni", authenticateJWT, nalogController.exportKasniNaloziExcel);
router.get("/korisnici/:korisnikId", authenticateJWT, nalogController.getKorisnikNalogById);

router.get("/", authenticateJWT, nalogController.getAllNalozi);
router.post("/novi", authenticateJWT, nalogController.createNalog);
router.put("/update/:id", authenticateJWT, nalogController.updateNalog);

// Ova ruta ostaje za aplikaciju (Quasar) jer ona šalje JWT
router.patch("/zatvori/:id", authenticateJWT, nalogController.updateZatvoriNalog);

// --- NOVA RUTA ZA E-MAIL (Bez authenticateJWT) ---
// Koristimo GET jer obični linkovi iz maila uvijek šalju GET zahtjev
router.get("/zatvori-direktno/:id", nalogController.handleEmailClosure);

router.get("/:id", authenticateJWT, nalogController.getNalogById);

export default router;