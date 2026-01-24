<template>
  <q-page padding>
    <div class="row q-col-gutter-md justify-center">
      <div class="col-12 col-md-6">
        <h5 class="q-mt-none q-mb-md">Postavke Notifikacija</h5>
        
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="text-h6 q-mb-sm">Konfiguracija intervala</div>
            <p class="text-caption text-grey-7">
              Ovdje definirate koliko dana prije isteka roka korisnik treba dobiti prvi email podsjetnik.
            </p>
            
            <q-item tag="label" v-ripple class="q-px-none">
              <q-item-section>
                <q-item-label>Status sustava</q-item-label>
                <q-item-label caption>Uključi ili isključi slanje svih automatskih obavijesti</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle v-model="postavke.omoguceno" color="green" />
              </q-item-section>
            </q-item>

            <q-separator class="q-my-md" />

            <q-input
              v-model.number="postavke.dana_prije_isteka"
              type="number"
              label="Podsjetnik dana prije isteka"
              filled
              suffix="dana"
              :disable="!postavke.omoguceno"
              hint="Npr. ako stavite 30, nalozi koji istječu za mjesec dana će aktivirati mail."
            />
          </q-card-section>

          <q-card-actions align="right" class="bg-grey-1">
            <q-btn 
              label="Spremi Postavke" 
              color="primary" 
              icon="save"
              @click="saveSettings" 
              :loading="submitting" 
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const submitting = ref(false);

// Inicijalno stanje
const postavke = ref({
  dana_prije_isteka: 30,
  omoguceno: true
});

// Dohvati trenutne vrijednosti iz baze pri učitavanju stranice
const fetchSettings = async () => {
  try {
    const response = await api.get('/postavke/notifikacije');
    if (response.data) {
      postavke.value = {
        ...response.data,
        omoguceno: !!response.data.omoguceno // Pretvori 1/0 u true/false
      };
    }
  } catch (error) {
    console.error('Greška pri dohvaćanju postavki:', error);
  }
};

// Spremi promjene na backend
const saveSettings = async () => {
  submitting.value = true;
  try {
    await api.post('/postavke/notifikacije', {
      dana_prije_isteka: postavke.value.dana_prije_isteka,
      omoguceno: postavke.value.omoguceno ? 1 : 0
    });
    
    $q.notify({
      type: 'positive',
      message: 'Postavke su uspješno spremljene!',
      position: 'top'
    });
  } catch (error) {
   console.error("Greška pri spremanju:", error); // Sada koristiš varijablu i ESLint je sretan
  $q.notify({
    type: 'negative',
    message: 'Došlo je do greške prilikom spremanja!'
  });
  } finally {
    submitting.value = false;
  }
};

onMounted(fetchSettings);
</script>
