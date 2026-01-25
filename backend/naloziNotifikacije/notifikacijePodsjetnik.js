import cron from 'node-cron';
import { findOrdersForNotifications } from './repository/nalogRepository.js';
import { sendReminder } from './service/mailService.js';
import { db } from '../config/db.js'; 

cron.schedule('* * * * *', async () => { //minute / sati / dan / mjesec / dan u tjednu
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
      
      // Kreiramo URL koji vodi do naše API rute za zatvaranje
      const urlZatvori = `http://localhost:3000/api/nalozi/zatvori-direktno/${nalog.id}`;

      // Tekstualna verzija (za svaki slučaj)
      const text = `Podsjetnik: Nalog "${nalog.naziv}" dospijeva ${nalog.rok_zavrsetka}. Ako je gotov, zatvorite ga ovdje: ${urlZatvori}`;

      // HTML verzija s gumbom
      const html = `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2>Podsjetnik za nalog</h2>
          <p>Nalog: <strong>${nalog.naziv}</strong></p>
          <p>Rok završetka: <strong>${nalog.rok_zavrsetka}</strong></p>
          <br>
          <p>Ako je ovaj nalog završen, kliknite na gumb ispod kako biste ga zatvorili:</p>
          <a href="${urlZatvori}" 
             style="background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
             Označi kao ZATVORENO
          </a>
        </div>
      `;

      try {
        // Šaljemo i text i html verziju
        await sendReminder(korisnikEmail, 'Automatski podsjetnik', text, html);
        
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