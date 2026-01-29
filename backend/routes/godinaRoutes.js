import { Router } from "express";
import * as godinaController from "../controllers/godinaController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
// Ispravljen naziv datoteke (maknut 'de' iz Mid-de-delware)
import supervisorMiddleware from "../middlewares/supervisorMiddleware.js";

const router = Router();

// 1. Prvo specifične GET rute
router.get("/zadnja", authenticateJWT, godinaController.getLastOpenedYear);

// 2. Općenite GET rute
router.get("/", authenticateJWT, supervisorMiddleware, godinaController.getAllGodine);

// 3. POST rute (zahtijevaju supervizora)
router.post("/otvori", authenticateJWT,supervisorMiddleware,  godinaController.openNewYear);

router.post('/resetiraj', authenticateJWT,supervisorMiddleware, godinaController.deleteYear);

export default router;