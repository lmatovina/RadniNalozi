import { Router } from "express";
import * as nalogController from "../controllers/nalogController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js"

const router = Router();



router.get("/", authenticateJWT, nalogController.getAllNalozi);
router.get("/godina", authenticateJWT, nalogController.getNaloziByYear);
router.get("/nadolazeci", authenticateJWT, nalogController.getNadolazeciNalozi);
router.get("/:id", authenticateJWT, nalogController.getNalogById);
router.post("/novi", authenticateJWT, nalogController.createNalog);
router.get('/naziviUloga', authenticateJWT, nalogController.getUloge)


export default router;