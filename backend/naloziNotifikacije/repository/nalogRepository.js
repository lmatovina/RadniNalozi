import { db } from '../../config/db.js'; 

export async function findOrdersDueInNext3Months() {
  const [rows] = await db.query(
    `SELECT n.*, k.email AS korisnik_email
     FROM Nalog n
     JOIN Korisnik k ON k.id = n.kreirao_korisnik_id
     WHERE n.status NOT IN ('Zatvoren', 'Arhiviran')
       AND n.rok_zavrsetka IS NOT NULL
       AND n.rok_zavrsetka BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 MONTH)
       AND (
            n.zadnji_podsjetnik IS NULL
            OR n.zadnji_podsjetnik < DATE_SUB(NOW(), INTERVAL 1 MONTH)
          )`
  );
  return rows;
}


