import { db } from '../../config/db.js'; 
export async function findOrdersForNotifications() {
  // 1. Prvo dohvaćamo postavke
  const [settings] = await db.query('SELECT dana_prije_isteka, omoguceno FROM PostavkeObavijesti WHERE id = 1');
  
  // Ako je sustav ugašen na frontendu, vraćamo praznu listu
  if (!settings[0] || settings[0].omoguceno === 0) {
    return { orders: [], enabled: false };
  }

  const days = settings[0].dana_prije_isteka;

  // 2. Tražimo naloge koristeći taj interval
  const [rows] = await db.query(
    `SELECT n.*, k.email AS korisnik_email
     FROM Nalog n
     JOIN Korisnik k ON k.id = n.kreirao_korisnik_id
     WHERE n.status NOT IN ('Zatvoren', 'Arhiviran')
       AND n.rok_zavrsetka BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
       AND (
            n.zadnji_podsjetnik IS NULL
            OR n.zadnji_podsjetnik < DATE_SUB(NOW(), INTERVAL 1 MONTH)
          )`,
    [days]
  );

  return { orders: rows, enabled: true };
}

