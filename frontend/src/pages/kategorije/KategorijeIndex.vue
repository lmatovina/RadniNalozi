<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <h5 class="q-my-none">Kategorije (Tipovi Naloga)</h5>
      <q-btn color="primary" icon="add" label="Dodaj novu" @click="openDialog()" />
    </div>

    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id"
      flat
      bordered
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat round color="blue" icon="edit" @click="openDialog(props.row)" />
          <q-btn flat round color="negative" icon="delete" @click="deleteItem(props.row.id)" />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogVisible" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ editMode ? 'Uredi kategoriju' : 'Nova kategorija' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input 
            v-model="formData.naziv" 
            label="Naziv kategorije *" 
            hint="Npr. Kurikulum"
            autofocus
            :rules="[val => !!val || 'Naziv je obavezan']"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Odustani" v-close-popup />
          <q-btn flat label="Spremi" @click="saveData" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios' // Pretpostavka da koristiš axios boot file
import { useQuasar } from 'quasar'

const $q = useQuasar()

// State
const rows = ref([])
const dialogVisible = ref(false)
const editMode = ref(false)
const formData = ref({ id: null, naziv: '' })

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'naziv', label: 'Naziv Kategorije', field: 'naziv', align: 'left', sortable: true },
  { name: 'actions', label: 'Akcije', align: 'center' }
]

// Dohvat podataka
const loadData = async () => {
  try {
    const res = await api.get('/api/tipovi-naloga')
    rows.value = res.data
  } catch  {
    $q.notify({color: 'negative', message: 'Greška pri učitavanju' })
  }
}

// Otvaranje forme
const openDialog = (item = null) => {
  if (item) {
    formData.value = { ...item }
    editMode.value = true
  } else {
    formData.value = { id: null, naziv: '' }
    editMode.value = false
  }
  dialogVisible.value = true
}

// Spremanje (Create / Update)
const saveData = async () => {
  try {
    if (editMode.value) {
      await api.put(`/api/tipovi-naloga/${formData.value.id}`, formData.value)
    } else {
      await api.post('/api/tipovi-naloga', formData.value) // <-- dodan /api
    }
    dialogVisible.value = false
    await loadData()
    $q.notify({ color: 'positive', message: 'Uspješno spremljeno' })
  } catch {
    $q.notify({ color: 'negative', message: 'Greška pri spremanju' })
  }
}

// Brisanje
const deleteItem = (id) => {
  $q.dialog({
    title: 'Potvrda',
    message: 'Želite li obrisati ovu kategoriju?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`/api/tipovi-naloga/${id}`) // <-- ispravljena ruta
      await loadData()
      $q.notify({ color: 'warning', message: 'Obrisano' })
    } catch {
      $q.notify({ color: 'negative', message: 'Greška pri brisanju' })
    }
  })
}

onMounted(loadData)
</script>