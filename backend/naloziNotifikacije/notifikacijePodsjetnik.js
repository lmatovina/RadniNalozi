import cron from 'node-cron';
import { findOrdersForNotifications } from './repository/nalogRepository.js';
import { sendReminder } from './service/mailService.js';
import { db } from '../config/db.js'; 

cron.schedule('* * * * *', async () => {
  console.log('--- Provjera automatizacije ---');

  try {
    const { orders, enabled } = await findOrdersForNotifications();

    if (!enabled) {
      console.log('Sustav obavijesti je ISKLJUČEN na upravljačkoj ploči.');
      return;
    }

    console.log(`Pronađeno naloga za slanje: ${orders.length}`);

    for (const nalog of orders) {
      const korisnikEmail = nalog.korisnik_email || 'test@example.com';
      const text = `Podsjetnik: Nalog "${nalog.naziv}" dospijeva ${nalog.rok_zavrsetka}.`;

      try {
        await sendReminder(korisnikEmail, 'Automatski podsjetnik', text);
        
        await db.query(
          'UPDATE Nalog SET zadnji_podsjetnik = NOW() WHERE id = ?',
          [nalog.id]
        );
        console.log(`✅ Obavijest poslana za nalog #${nalog.id}`);
      } catch (err) {
        console.error(`❌ Neuspješno slanje za nalog ${nalog.id}:`, err.message);
      }
    }
  } catch (error) {
    console.error('Kritična greška u cron poslu:', error);
  }
});