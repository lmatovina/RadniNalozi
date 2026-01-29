<template>
  <q-page padding class="bg-grey-1">
    <div class="q-pa-md">
      
      <div class="row items-center q-mb-lg">
        <q-btn 
          flat 
          round 
          icon="arrow_back" 
          @click="$router.push('/admin')" 
          class="q-mr-md"
        />
        <div>
          <div class="text-h4 text-primary q-mb-xs text-weight-bold">Otvaranje nove godine</div>
          <q-breadcrumbs class="text-grey-7">
            <q-breadcrumbs-el icon="home" to="/admin" label="Admin" />
            <q-breadcrumbs-el icon="calendar_today" label="Nova godina" />
          </q-breadcrumbs>
        </div>
      </div>

      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-8">
          <q-card class="shadow-2 border-radius-lg">
            <q-card-section class="bg-primary text-white q-pa-md">
              <div class="text-h6">Konfiguracija nove godine</div>
              <div class="text-caption">Kopirajte naloge iz postojeće godine u novu</div>
            </q-card-section>

            <q-card-section class="q-pa-lg">
              <div class="q-mb-lg">
                <div class="text-subtitle1 q-mb-sm text-weight-medium text-grey-9">Odaberite izvornu godinu</div>
                <q-select
                  v-model="selectedYear"
                  :options="godineOptions"
                  label="Izvor podataka"
                  outlined
                  dense
                  emit-value
                  map-options
                  :loading="loading.godine"
                >
                  <template v-slot:prepend><q-icon name="history" color="primary" /></template>
                </q-select>
              </div>

              <div class="q-mb-lg">
                <div class="text-subtitle1 q-mb-sm text-weight-medium text-grey-9">Nova poslovna godina</div>
                <q-input
                  v-model.number="novaGodina"
                  label="Unesite godinu"
                  outlined
                  dense
                  type="number"
                >
                  <template v-slot:prepend><q-icon name="update" color="primary" /></template>
                </q-input>
              </div>

              <q-banner v-if="selectedYear" dense class="bg-blue-1 text-blue-9 rounded-borders q-mb-xl q-pa-md">
                <template v-slot:avatar><q-icon name="info" /></template>
                Podaci će se kopirati iz <strong>{{ selectedYear }}</strong> u <strong>{{ novaGodina || '?' }}</strong>.
              </q-banner>

              <div class="row q-gutter-md justify-end items-center">
                
                <q-input 
                  v-model="confirmYearInput" 
                  label="Potvrdi godinu za reset" 
                  outlined 
                  dense 
                  style="width: 200px"
                  placeholder="Upiši godinu..."
                  mask="####"
                />

                <q-btn flat color="grey-7" label="Odustani" icon="close" @click="$router.push('/admin')" />
                
                <q-btn 
                  outline 
                  color="negative" 
                  icon="restart_alt" 
                  label="Resetiraj" 
                  :disabled="confirmYearInput !== String(selectedYear)"
                  @click="showConfirmDialog = true" 
                />

                <q-btn 
                  color="primary" 
                  icon="add_circle" 
                  label="Otvori godinu" 
                  :loading="loading.open" 
                  @click="openNewYear" 
                />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-4">
          <transition appear enter-active-class="animated fadeIn">
            <q-card v-if="statusMessage" class="q-mb-md shadow-1" :class="statusClass">
              <q-card-section class="row items-center no-wrap">
                <q-icon :name="statusIcon" size="md" class="q-mr-md" />
                <div>
                  <div class="text-weight-bold">{{ statusTitle }}</div>
                  <div class="text-caption">{{ statusMessage }}</div>
                </div>
              </q-card-section>
            </q-card>
          </transition>

          <q-card class="shadow-1">
            <q-card-section class="bg-grey-2 text-weight-bold">Info panel</q-card-section>
            <q-list separator>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Zadnja evidentirana godina</q-item-label>
                  <q-item-label class="text-h6 text-primary">{{ lastYear || 'Nema podataka' }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </div>
    </div>

    <q-dialog v-model="showConfirmDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="bg-negative text-white q-pa-md row items-center">
          <q-icon name="warning" size="md" class="q-mr-sm" />
          <div class="text-h6">Kritična operacija!</div>
        </q-card-section>

        <q-card-section class="q-pa-md text-center">
          Jeste li sigurni da želite obrisati <strong>SVE</strong> naloge i korisničke naloge za godinu 
          <span class="text-red text-weight-bold">{{ selectedYear }}</span>? 
          <br>Ova akcija je nepovratna.
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Odustani" color="grey-8" v-close-popup />
          <q-btn unelevated label="Da, trajno obriši" color="negative" @click="resetYear" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import * as NovaGodinaService from 'src/services/novaGodinaService' 

const $q = useQuasar()

// State
const godine = ref([])
const selectedYear = ref(null)
const novaGodina = ref(null)
const lastYear = ref(null)
const confirmYearInput = ref('') // Za sigurnosni input
const showConfirmDialog = ref(false)
const loading = ref({ godine: false, open: false })

// Status poruke za UI
const statusMessage = ref('')
const statusTitle = ref('')
const statusClass = ref('')
const statusIcon = ref('')

// Computed opcije za q-select
const godineOptions = computed(() => {
  return godine.value
    .map(g => ({ label: `Godina ${g}`, value: g }))
    .sort((a, b) => b.value - a.value)
})

const setStatus = (type, title, msg) => {
  statusTitle.value = title
  statusMessage.value = msg
  if (type === 'success') {
    statusClass.value = 'bg-green-1 text-green-9 border-green'
    statusIcon.value = 'check_circle'
  } else if (type === 'error') {
    statusClass.value = 'bg-red-1 text-red-9 border-red'
    statusIcon.value = 'report'
  }
}

// Učitavanje podataka
const loadData = async () => {
  loading.value.godine = true
  try {
    const podaci = await NovaGodinaService.getAllGodine()
    godine.value = podaci

    if (godine.value.length > 0) {
      const maxYear = Math.max(...godine.value.map(Number))
      lastYear.value = maxYear
      selectedYear.value = maxYear
      novaGodina.value = maxYear + 1
    }
  } catch (error) {
    console.error('[PAGE] Greška pri učitavanju:', error)
    setStatus('error', 'Greška', 'Problem s dohvaćanjem godina iz baze.')
  } finally {
    loading.value.godine = false
  }
}

// Otvaranje nove godine (Kopiranje)
const openNewYear = async () => {
  if (!novaGodina.value) {
    $q.notify({ type: 'warning', message: 'Molimo unesite godinu.' })
    return
  }

  loading.value.open = true
  try {
    await NovaGodinaService.otvoriGodinu(novaGodina.value)
    $q.notify({ type: 'positive', message: `Godina ${novaGodina.value} uspješno kreirana!` })
    setStatus('success', 'Uspjeh', `Godina ${novaGodina.value} je sada aktivna.`)
    await loadData()
  } catch (error) {
    console.error('[PAGE] Greška pri otvaranju:', error)
    $q.notify({ type: 'negative', message: 'Otvaranje godine nije uspjelo.' })
  } finally {
    loading.value.open = false
  }
}

// Resetiranje (Brisanje) godine
const resetYear = async () => {
  showConfirmDialog.value = false
  
  try {
    await NovaGodinaService.deleteGodina(selectedYear.value)
    $q.notify({ type: 'positive', message: `Godina ${selectedYear.value} je resetirana.` })
    confirmYearInput.value = '' // Resetiraj sigurnosni input
    await loadData()
  } catch (error) {
    console.error('[PAGE] Greška pri resetu:', error)
    $q.notify({ type: 'negative', message: 'Brisanje nije uspjelo.' })
  }
}

onMounted(loadData)
</script>

<style scoped>
.border-radius-lg { border-radius: 12px; }
.border-green { border: 1px solid #4caf50; }
.border-red { border: 1px solid #f44336; }
.border-blue { border: 1px solid #2196f3; }
</style>