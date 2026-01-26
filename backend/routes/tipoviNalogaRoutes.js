import { Router } from "express";
import * as nalogController from "../controllers/nalogController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js"

const router = Router();

router.get('/naziv-tipa-naloga', authenticateJWT, nalogController.getTipoviNaloga)

// CRUD rute za upravljanje kategorijama
router.get('/', authenticateJWT, nalogController.getTipoviNaloga);         // Dohvat svih
router.post('/', authenticateJWT, nalogController.createTipNaloga);         // Novo
router.put('/:id', authenticateJWT, nalogController.updateTipNaloga);       // Uredi
router.delete('/:id', authenticateJWT, nalogController.deleteTipNaloga);    // Briši

export default router;