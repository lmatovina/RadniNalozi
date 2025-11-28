const supervisorMiddleware = (req, res, next) => {
    // req.user je postavljen od strane authMiddleware.authenticateJWT
    if (req.user && req.user.je_supervizor === 1) {
        next(); // Korisnik je Supervizor, dozvoli prolaz
    } else {
        // Vraćamo 403 Forbidden za nedostajuće ovlasti
        return res.status(403).json({ 
            error: "Pristup zabranjen.",
            message: "Za kreiranje uloga potrebna je Supervizorska uloga."
        });
    }
};

export default supervisorMiddleware;