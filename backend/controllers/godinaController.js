import * as godinaService from "../services/godinaService.js";

export const getAllGodine = async (req, res) => {
    try {
        const godine = await godinaService.getAllGodine();
        res.json(godine);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getLastOpenedYear = async (req, res) => {
    try {
        const zadnja = await godinaService.getLastOpenedYear();
        res.json({ zadnjaGodina: zadnja });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const openNewYear = async (req, res) => {
    try {
        const { novaGodina } = req.body;
        // req.user.id dolazi iz authenticateJWT middleware-a
        const result = await godinaService.openNewYear(novaGodina, req.user.id);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteYear = async (req, res) => {
    try {
        const { godina } = req.body;

        if (!godina) {
            return res.status(400).json({ error: 'Niste poslali godinu za reset.' });
        }

        // Zovemo servis umjesto direktnog db.query
        const result = await godinaService.deleteYearData(godina);
        
        res.json(result);
    } catch (error) {
        console.error('[CONTROLLER] Reset error:', error);
        res.status(500).json({ error: error.message });
    }
};