<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h4">
        <q-icon name="people" /> Upravljanje Korisnicima
      </div>
      <q-btn 
        color="primary" 
        label="Novi Korisnik" 
        @click="showCreateDialog = true"
        icon="add_circle"
      />
    </div>

    <q-table
      :rows="korisnici"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :filter="filter"
      no-data-label="Nema dostupnih korisnika"
      class="shadow-2"
    >
      <template v-slot:top-right>
        <q-input dense debounce="300" v-model="filter" placeholder="Pretraži">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-je_supervizor="props">
        <q-td :props="props">
          <q-toggle
            v-model="props.row.je_supervizor"
            color="red"
            checked-icon="admin_panel_settings"
            unchecked-icon="person"
            :disable="props.row.id === myUserId" 
            @update:model-value="toggleSupervizorStatus(props.row)"
          />
          <q-tooltip v-if="props.row.id === myUserId">
            Ne možete promijeniti vlastiti status.
          </q-tooltip>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="showCreateDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Kreiraj Novog Korisnika</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="createNewKorisnik">
            <q-input 
              filled 
              v-model="newKorisnik.ime" 
              label="Ime *" 
              lazy-rules
              :rules="[val => !!val || 'Ime je obavezno']"
              class="q-mb-sm"
            />
            <q-input 
              filled 
              v-model="newKorisnik.prezime" 
              label="Prezime *" 
              lazy-rules
              :rules="[val => !!val || 'Prezime je obavezno']"
              class="q-mb-sm"
            />
            <q-input 
              filled 
              v-model="newKorisnik.email" 
              type="email" 
              label="Email *" 
              lazy-rules
              :rules="[
                val => !!val || 'Email je obavezan',
                val => /.+@.+\..+/.test(val) || 'Nevažeći format emaila'
              ]"
              class="q-mb-sm"
            />
            <q-input 
              filled 
              v-model="newKorisnik.lozinka" 
              type="password" 
              label="Privremena lozinka *" 
              lazy-rules
              :rules="[val => !!val || 'Lozinka je obavezna']"
              class="q-mb-sm"
            />
            <q-checkbox 
              v-model="newKorisnik.je_supervizor" 
              label="Postavi kao Supervizora" 
              color="red"
              class="q-mt-sm"
            />
            <q-card-actions align="right" class="text-primary q-mt-md">
              <q-btn flat label="Odustani" v-close-popup color="negative" />
              <q-btn label="Spremi" type="submit" color="primary" :loading="isSaving" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
// Uklanjamo direktni import Axiosa.
// Uklanjamo const API_URL.

// ✅ Uvozimo sav servisni sloj za korisnike
import * as KorisniciService from '../../services/korisniciService.js'; 


export default defineComponent({
  name: 'KorisniciManager',
  setup() {
    const $q = useQuasar();
    const korisnici = ref([]);
    const loading = ref(false);
    const filter = ref('');
    const showCreateDialog = ref(false);
    const isSaving = ref(false);

    // Ovdje bi se dohvaćao ID trenutno prijavljenog korisnika
    const myUserId = ref(11); 

    const newKorisnik = ref({
      ime: '',
      prezime: '',
      email: '',
      lozinka: '',
      je_supervizor: false,
    });

    const columns = [
      { name: 'ime', align: 'left', label: 'Ime', field: 'ime', sortable: true },
      { name: 'prezime', align: 'left', label: 'Prezime', field: 'prezime', sortable: true },
      { name: 'email', align: 'left', label: 'Email (Korisničko ime)', field: 'email', sortable: true },
      { 
        name: 'je_supervizor', 
        align: 'center', 
        label: 'Supervizor', 
        field: 'je_supervizor', 
        sortable: true 
      },
    ];

    /**
     * Dohvaća listu svih korisnika s backend servisa
     */
    const fetchKorisnici = async () => {
      loading.value = true;
      try {
        // ✅ Korištenje servisne funkcije
        const response = await KorisniciService.getAllKorisnici();
        
        // response je već array podataka (response.data iz servisa)
        korisnici.value = response.map(k => ({
          ...k,
          je_supervizor: k.je_supervizor === 1,
        }));
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Greška pri dohvaćanju korisnika.',
          caption: error.response?.data?.error || 'Došlo je do greške na serveru.'
        });
      } finally {
        loading.value = false;
      }
    };

    /**
     * Ažurira status 'je_supervizor' u bazi
     */
    const toggleSupervizorStatus = async (korisnik) => {
      // Prevencija promjene vlastitog statusa
      if (korisnik.id === myUserId.value) {
          $q.notify({
            type: 'warning',
            message: 'Ne možete mijenjati vlastiti Supervizor status.',
          });
          korisnik.je_supervizor = !korisnik.je_supervizor;
          return;
      }

      const newStatus = korisnik.je_supervizor; // status je već promijenjen u v-modelu
      
      try {
        // ✅ Korištenje servisne funkcije
        await KorisniciService.updateKorisnikSupervizorStatus(korisnik.id, newStatus);
        
        $q.notify({
          type: 'positive',
          message: `${korisnik.ime} ${korisnik.prezime} je sada ${newStatus ? 'Supervizor' : 'obični Korisnik'}.`,
        });
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Greška pri ažuriranju statusa.',
          caption: error.response?.data?.error || 'Došlo je do greške na serveru.'
        });
        // U slučaju greške, vratiti status na prethodnu vrijednost u UI
        korisnik.je_supervizor = !newStatus; 
      }
    };

    /**
     * Kreira novog korisnika
     */
    const createNewKorisnik = async () => {
      isSaving.value = true;
      try {
        // ✅ Korištenje servisne funkcije
        const response = await KorisniciService.createKorisnik(newKorisnik.value);
        
        $q.notify({
          message: `Korisnik ${response.ime} ${response.prezime} uspješno kreiran.`,
          type: 'positive',
        });
        
        // Ažuriraj listu i zatvori modal
        await fetchKorisnici(); 
        showCreateDialog.value = false;

        // Resetiraj formu
        newKorisnik.value = {
          ime: '',
          prezime: '',
          email: '',
          lozinka: '',
          je_supervizor: false,
        };

      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Kreiranje korisnika neuspješno.',
          caption: error.response?.data?.error || 'Došlo je do greške na serveru.'
        });
      } finally {
        isSaving.value = false;
      }
    };

    // Dohvati podatke kada se komponenta učita
    onMounted(fetchKorisnici);

    return {
      korisnici,
      columns,
      loading,
      filter,
      showCreateDialog,
      newKorisnik,
      isSaving,
      myUserId,
      toggleSupervizorStatus,
      createNewKorisnik,
    };
  }
});
</script>

<style scoped>
/* Dodatni stilovi ako su potrebni */
</style>