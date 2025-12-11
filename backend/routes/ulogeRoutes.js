 import { Router } from "express";
import * as ulogaController from "../controllers/ulogaController.js";
import * as nalogController from "../controllers/nalogController.js";

//import authMiddleware from "../middlewares/authMiddleware.js";
//import supervisorMiddleware from "../middlewares/supervisorMiddleware.js";

import { authenticateJWT } from "../middlewares/authMiddleware.js"; 

import supervisorMiddleware from "../middlewares/supervisorMiddleware.js";

const router = Router();

// POST /api/uloge: Kreiranje nove uloge (Autentikacija + Autorizacija Supervizor)
router.post("/", 
    authenticateJWT, 
    supervisorMiddleware, 
    ulogaController.createUloga
);

// GET /api/uloge: Dohvat svih uloga (Samo Autentikacija)
router.get("/", 
    authenticateJWT, 
    ulogaController.getAllUloge
);

// GET /api/uloge/:id/members: Dohvat èlanova uloge (Samo Autentikacija)
router.get("/:id/members", 
    authenticateJWT, 
    ulogaController.getUlogaMembers
);

// DELETE /api/uloge/:ulogaId/korisnik/:korisnikId : Uklanjanje èlana (Supervizor)
router.delete("/:ulogaId/korisnik/:korisnikId", 
    authenticateJWT, 
    supervisorMiddleware, 
    ulogaController.removeMember
);

//DELETE /api/uloge/:id: Brisanje cijele uloge
router.delete("/:id", 
    authenticateJWT, 
    supervisorMiddleware, 
    ulogaController.deleteUloga
);

router.get('/naziviUloga', authenticateJWT, nalogController.getUloge)

export default router;