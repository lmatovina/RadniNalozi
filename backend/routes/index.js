import { Router } from "express";
import naloziRoutes from "./naloziRoutes.js";
import authRoutes from "./authRoutes.js";
import korisniciRoute from "./korisniciRoute.js"


const router = Router();

router.use("/nalozi", naloziRoutes);
router.use("/auth", authRoutes);

router.use("/korisnici", korisniciRoute);
/*
router.get("/nalozi", nalogController.getAllNalozi);
router.get("/nalozi/:id", nalogController.getNalogById);
router.get("/nalozi/godina/:year", nalogController.getNaloziByYear);*/

export default router;
