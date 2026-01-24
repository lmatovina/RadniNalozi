import express from 'express';
import { db } from '../config/db.js';

const router = express.Router();

// GET: Dohvati postavke (za onMounted u Quasaru)
router.get('/notifications', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM PostavkeObavijesti LIMIT 1');
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Greška pri dohvaćanju postavki' });
  }
});

// POST: Spremi promjene s frontenda
router.post('/notifications', async (req, res) => {
  const { dana_prije_isteka, omoguceno } = req.body;
  try {
    await db.query(
      'UPDATE PostavkeObavijesti SET dana_prije_isteka = ?, omoguceno = ? WHERE id = 1',
      [dana_prije_isteka, omoguceno ? 1 : 0]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Greška pri spremanju' });
  }
});

export default router;