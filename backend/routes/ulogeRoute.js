import { Router } from "express";
import * as ulogaController from "../controllers/ulogaController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import supervisorMiddleware from "../middlewares/supervisorMiddleware.js";

const router = Router();

// POST /api/uloge: Kreiranje nove uloge (Zahtijeva autentičnog korisnika I supervizora)
//router.post("/", authMiddleware, supervisorMiddleware, ulogaController.createUloga);

router.post("/", 
    authMiddleware.authenticateJWT, 
    supervisorMiddleware, 
    ulogaController.createUloga
);
//router.post("/", authMiddleware.authenticateJWT, supervisorMiddleware, ulogaController.createUloga);

// GET /api/uloge: Dohvat svih uloga (Zahtijeva autentičnog korisnika, ali ne nužno supervizora)
//router.get("/", authMiddleware, ulogaController.getAllUloge);
router.get("/", 
    authMiddleware.authenticateJWT, 
    ulogaController.getAllUloge
);

export default router;