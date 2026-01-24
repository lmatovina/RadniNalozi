import cron from 'node-cron';
import { findOrdersDueInNext3Months } from './repository/nalogRepository.js';
import { sendReminder } from './service/mailService.js';
import { db } from '../config/db.js'; 

cron.schedule('* * * * *', async () => {
  console.log('--- Pokrećem provjeru podsjetnika ---');

  try {
    const orders = await findOrdersDueInNext3Months();
    console.log(`Pronađeno naloga za podsjetnik: ${orders.length}`);

    for (const nalog of orders) {
      // Prioritet ima email iz baze, ako ga nema koristi se fallback 
      const korisnikEmail = nalog.korisnik_email || 'test@example.com';
      console.log(`Pokušavam poslati mail za nalog ID ${nalog.id} na adresu: ${korisnikEmail}`);

      const text = `Nalog "${nalog.naziv}" istječe ${nalog.rok_zavrsetka}. Molimo da ga završite.`;
      
      try {
        await sendReminder(korisnikEmail, 'Podsjetnik na nalog', text);
        console.log(`✅ Mail uspješno poslan za nalog: ${nalog.naziv}`);

        await db.query(
          'UPDATE Nalog SET zadnji_podsjetnik = NOW() WHERE id = ?',
          [nalog.id]
        );
        console.log(`💾 Baza ažurirana (zadnji_podsjetnik) za ID ${nalog.id}`);
      } catch (mailError) {
        console.error(`❌ Greška pri slanju maila za nalog ${nalog.id}:`, mailError.message);
      }
    }
  } catch (dbError) {
    console.error('❌ Greška pri dohvaćanju naloga iz baze:', dbError.message);
  }
  
  console.log('--- Završena provjera ---');
});
