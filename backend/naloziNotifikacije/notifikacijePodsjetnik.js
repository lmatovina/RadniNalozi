import cron from 'node-cron';
import { findOrdersDueInNext3Months } from './repository/nalogRepository.js';
import { sendReminder } from './service/mailService.js';
import { db } from '../config/db.js'; 

cron.schedule('* * * * *', async () => { // svaki dan u 08:00
  console.log('Pokrećem podsjetnik...');

  const orders = await findOrdersDueInNext3Months();

 for (const nalog of orders) {
  const korisnikEmail = nalog.korisnik_email || 'test@example.com';

  const text = `Nalog "${nalog.naziv}" istječe ${nalog.rok_zavrsetka}. Molimo da ga završite.`;
  await sendReminder(korisnikEmail, 'Podsjetnik na nalog', text);
   await db.query(
    'UPDATE Nalog SET zadnji_podsjetnik = NOW() WHERE id = ?',
    [nalog.id]
  );
}
});
