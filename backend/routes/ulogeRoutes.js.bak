import { Router } from "express";
import * as nalogController from "../controllers/nalogController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js"

const router = Router();

router.get('/naziviUloga', authenticateJWT, nalogController.getUloge)

export default router;