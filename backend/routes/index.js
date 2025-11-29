import { Router } from "express";
import naloziRoutes from "./naloziRoutes.js";
import authRoutes from "./authRoutes.js";
import korisniciRoute from "./korisniciRoute.js"
import ulogeRoutes from "./ulogeRoutes.js"
import tipoviNaloga from "./tipoviNalogaRoutes.js";

const router = Router();

router.use("/nalozi", naloziRoutes);
router.use("/auth", authRoutes);
router.use("/korisnici", korisniciRoute);
router.use("/uloge", ulogeRoutes);
router.use("/tipovi-naloga", tipoviNaloga);

export default router;
