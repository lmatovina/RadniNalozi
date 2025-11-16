import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend radi!" });
});

app.listen(3000, () => console.log("Server radi na http://localhost:3000"));
