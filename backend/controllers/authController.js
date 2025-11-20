import * as authService from "../services/authService.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);

    if (!result) {
      return res.status(401).json({ error: "Neispravni podaci" });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška na serveru" });
  }
};
