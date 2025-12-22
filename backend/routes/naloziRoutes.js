import { Router } from "express";
import * as nalogController from "../controllers/nalogController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js"

const router = Router();

router.get("/godina", authenticateJWT, nalogController.getNaloziByYear);
router.get("/nadolazeci", authenticateJWT, nalogController.getNadolazeciNalozi);
router.get("/naziviUloga", authenticateJWT, nalogController.getUloge);
router.get("/korisnici/:korisnikId", authenticateJWT, nalogController.getKorisnikNalogById);

router.get("/", authenticateJWT, nalogController.getAllNalozi);
router.post("/novi", authenticateJWT, nalogController.createNalog);
router.patch("/zatvori/:id", authenticateJWT, nalogController.updateZatvoriNalog);


router.get("/:id", authenticateJWT, nalogController.getNalogById);

export default router;
