<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h4">
        <q-icon name="group_add" /> Upravljanje Ulogama (Timovima)
      </div>
      <q-btn 
        color="primary" 
        label="Kreiraj Novu Ulogu" 
        @click="showCreateDialog = true"
        icon="add_circle"
      />
    </div>

    <q-table
      :rows="uloge"
      :columns="columns"
      row-key="id"
      :loading="loading"
      no-data-label="Nema definiranih uloga"
      class="shadow-2"
    />

    <q-dialog v-model="showCreateDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Kreiranje Nove Uloge (Tima)</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="handleCreateUloga">
            
            <q-input 
              filled 
              v-model="newUloga.naziv" 
              label="Naziv Uloge *" 
              lazy-rules
              :rules="[val => !!val || 'Naziv je obavezan']"
              class="q-mb-sm"
            />
            
            <q-input 
              filled 
              v-model="newUloga.opis" 
              label="Opis Uloge (opcionalno)" 
              type="textarea"
              rows="3"
              class="q-mb-sm"
            />

            <q-select
              filled
              v-model="selectedUserIds"
              :options="userOptions"
              label="Dodijeli članove u ulogu (Korisnici)"
              multiple
              use-chips
              option-value="id"
              option-label="label"
              emit-value
              map-options
              hint="Odaberite korisnike koji će biti članovi ovog tima."
              class="q-mt-md"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Nema dostupnih korisnika
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-card-actions align="right" class="text-primary q-mt-lg">
              <q-btn flat label="Odustani" v-close-popup color="negative" />
              <q-btn label="Kreiraj Ulogu" type="submit" color="primary" :loading="isSaving" />
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
// Uvozimo servis za korisnike (potreban za dohvat liste korisnika za select)
import * as KorisniciService from '../../services/korisniciService.js'; 
// Uvozimo novi servis za uloge
import * as UlogeService from '../../services/ulogeService.js';


export default defineComponent({
  name: 'UlogeManager',
  setup() {
    const $q = useQuasar();
    const uloge = ref([]);
    const loading = ref(false);
    const showCreateDialog = ref(false);
    const isSaving = ref(false);
    
    // Lista korisnika u formatu za QSelect
    const userOptions = ref([]); 
    
    // Model za novu ulogu
    const newUloga = ref({
      naziv: '',
      opis: '',
    });

    // V-model za odabrane korisnike (samo ID-evi)
    const selectedUserIds = ref([]); 

    const columns = [
      { name: 'naziv', align: 'left', label: 'Naziv Uloge', field: 'naziv', sortable: true },
      { name: 'opis', align: 'left', label: 'Opis', field: 'opis', sortable: true },
      { name: 'kreirao_korisnik_id', align: 'center', label: 'Kreirao (ID)', field: 'kreirao_korisnik_id', sortable: true },
    ];

    /**
     * Dohvaća sve korisnike i formatira ih za QSelect
     */
    const fetchKorisniciForSelect = async () => {
      try {
        // Koristimo već postojeći servis za korisnike
        const korisniciData = await KorisniciService.getAllKorisnici();
        userOptions.value = korisniciData.map(k => ({
          label: `${k.ime} ${k.prezime} (${k.email})`,
          id: k.id
        }));
      } catch (error) {
         console.error('Greška pri dohvaćanju korisnika:', error);
         // Ovdje ne želimo obavijestiti korisnika, jer je ovo samo pomoćni dio
      }
    };

    /**
     * Dohvaća listu svih uloga
     */
    const fetchUloge = async () => {
        loading.value = true;
        try {
            uloge.value = await UlogeService.getAllUloge();
        } catch (error) {
            $q.notify({
                type: 'negative',
                message: 'Greška pri dohvaćanju uloga.',
                caption: error.response?.data?.error || 'Došlo je do greške na serveru.'
            });
        } finally {
            loading.value = false;
        }
    };

    /**
     * Obrađuje submit forme za kreiranje uloge
     */
    const handleCreateUloga = async () => {
      isSaving.value = true;
      try {
        // Podaci za slanje na backend (uključuje samo ID-eve korisnika)
        const payload = {
            ...newUloga.value,
            korisnikIds: selectedUserIds.value 
        };

        const novaUloga = await UlogeService.createUloga(payload);
        
        $q.notify({
          type: 'positive',
          message: `Uloga "${novaUloga.naziv}" uspješno kreirana.`,
        });
        
        // Ažuriraj listu i zatvori modal
        await fetchUloge(); 
        showCreateDialog.value = false;

        // Resetiraj formu
        newUloga.value = { naziv: '', opis: '' };
        selectedUserIds.value = [];

      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Kreiranje uloge neuspješno.',
          caption: error.response?.data?.error || 'Došlo je do greške na serveru.'
        });
      } finally {
        isSaving.value = false;
      }
    };

    // Dohvati podatke kada se komponenta učita
    onMounted(() => {
        fetchUloge();
        fetchKorisniciForSelect();
    });

    return {
      uloge,
      columns,
      loading,
      showCreateDialog,
      newUloga,
      isSaving,
      userOptions,
      selectedUserIds,
      handleCreateUloga,
    };
  }
});
</script>

<style scoped>
/* Dodatni stilovi ako su potrebni */
</style>