// routes/korisniciRoute.js - ISPRAVLJENO
import { Router } from "express";
import * as korisnikController from "../controllers/korisnikController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js"; // SAMO OVAJ IMPORT
import supervisorMiddleware from "../middlewares/supervisorMiddleware.js";

const router = Router();

// ==================== GET RUTE ====================

// 1. Paginacija: GET /api/korisnici?page=1&limit=10
router.get("/", 
    authenticateJWT, 
    korisnikController.getAllKorisnici
);

// 2. Pretraga: GET /api/korisnici/search?q=term
router.get("/search", 
    authenticateJWT, 
    korisnikController.searchKorisnici
);

// ==================== POST RUTE ====================

// 3. Kreiranje: POST /api/korisnici
router.post("/", 
    authenticateJWT, 
    supervisorMiddleware, 
    korisnikController.createKorisnik
);

// ==================== PATCH RUTE ====================

// 4. Ažuriranje supervizora: PATCH /api/korisnici/:id/supervizor
router.patch("/:id/supervizor", 
    authenticateJWT, 
    supervisorMiddleware, 
    korisnikController.updateSupervizorStatus
);

router.put(
  "/change-password",
  authenticateJWT,
  korisnikController.changePassword
);

export default router;

// routes/korisniciRoute.js
/*import { Router } from "express";
import * as korisnikController from "../controllers/korisnikController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import supervisorMiddleware from "../middlewares/supervisorMiddleware.js";

const router = Router();

// Endpoint za dohvat svih korisnika
router.get("/", authenticateJWT, korisnikController.getAllKorisnici);

// Endpoint za kreiranje novog korisnika
router.post("/", authenticateJWT,supervisorMiddleware, korisnikController.createKorisnik);

// Endpoint za ažuriranje statusa supervizora (PUT/PATCH za promjenu dijela resursa)
router.patch("/:id/supervizor", authenticateJWT,supervisorMiddleware, korisnikController.updateSupervizorStatus);

// Koristimo getFilteredKorisnici za dohvaćanje svih (bez queryja) ili filtriranih (s queryjem)
// GET /api/korisnici?search=term
router.get("/", authMiddleware.authenticateJWT, korisnikController.getFilteredKorisnici);


// GET /api/korisnici/search?q=term
router.get("/search", authMiddleware.authenticateJWT, korisnikController.searchKorisnici);

export default router;*/