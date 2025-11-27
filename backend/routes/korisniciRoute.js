// routes/korisniciRoute.js
import { Router } from "express";
import * as korisnikController from "../controllers/korisnikController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = Router();

// Endpoint za dohvat svih korisnika
router.get("/", authenticateJWT, korisnikController.getAllKorisnici);

// Endpoint za kreiranje novog korisnika
router.post("/", authenticateJWT, korisnikController.createKorisnik);

// Endpoint za ažuriranje statusa supervizora (PUT/PATCH za promjenu dijela resursa)
router.patch("/:id/supervizor", authenticateJWT, korisnikController.updateSupervizorStatus);

export default router;