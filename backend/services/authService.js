import { db } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-ultra-tajni-jwt-kljuc-123456789";


export const loginUser = async (email, password) => {
  try {
    // ispravna tablica i kolona lozinke
    const [rows] = await db.query(
      "SELECT * FROM Korisnik WHERE email = ?",
      [email]
    );
    const user = rows[0];
    if (!user) return null;

    
    const match = await bcrypt.compare(password, user.lozinka_hash);
    if (!match) return null;

  
    const token = jwt.sign(
      { id: user.id, je_supervizor: user.je_supervizor },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        je_supervizor: user.je_supervizor
      }
    };
  } catch (err) {
    console.error("Greška u loginUser:", err);
    throw err;
  }
};
``

