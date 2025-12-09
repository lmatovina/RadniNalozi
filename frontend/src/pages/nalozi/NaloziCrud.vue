<template>
  <q-page padding>
    <h5>Radni nalozi</h5>

    

    <q-table
      :rows="nalozi"
      :columns="columns"
      row-key="id"
      flat
      bordered
      @row-click="rowKlik"
    />

    <q-separator class="q-my-md" />

    <q-form @submit.prevent="spremiNalog">
      <h6>{{ editId ? 'Uredi nalog' : 'Novi nalog' }}</h6>

          <q-select
        v-model="form.uloga_id"
        :options="uloge"
        option-value="id"
        option-label="naziv"
        label="Uloga"
        dense
        outlined
        class="q-mb-sm"
      />

      <q-select
        v-model="form.tip_naloga_id"
        :options="tipoviNaloga"
        option-value="id"
        option-label="naziv"
        label="Tip naloga"
        dense
        outlined
        class="q-mb-sm"
      />


      <q-input v-model="form.naziv" label="Naziv" dense outlined class="q-mb-sm" />
      <q-input
        v-model="form.sadrzaj"
        label="Sadržaj"
        type="textarea"
        outlined
        class="q-mb-sm"
      />
      <q-input
        v-model="form.rok_zavrsetka"
        label="Rok završetka (YYYY-MM-DD)"
        dense
        outlined
        class="q-mb-sm"
      />
      <div class="q-gutter-sm q-mt-sm">
        <q-btn type="submit" color="primary" :label="editId ? 'Spremi izmjene' : 'Kreiraj nalog'" />
        <q-btn v-if="editId" flat color="negative" label="Obriši nalog" @click="obrisiNalog" />
        <q-btn v-if="editId" flat label="Očisti formu" @click="novoKlik" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  getAllNalozi,
  createNalog,
  updateNalog,
  deleteNalog,
  getAllUloge,
  getAllTipoviNaloga
} from 'src/services/naloziService'


const uloge = ref([])
const tipoviNaloga = ref([])
const nalozi = ref([])
const editId = ref(null)
const form = ref({
  uloga_id: null,
  tip_naloga_id: null,
  kreirao_korisnik_id: null,
  naziv: '',
  sadrzaj: '',
  rok_zavrsetka: ''
})

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'naziv', label: 'Naziv', field: 'naziv', align: 'left' },
  { name: 'rok_zavrsetka', label: 'Rok', field: 'rok_zavrsetka', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' }
]

const ucitajNaloze = async () => {
  const data = await getAllNalozi()
  nalozi.value = data
}

const ucitajUloge = async () => {
  uloge.value = await getAllUloge()
}

const ucitajTipoveNaloga = async () => {
  tipoviNaloga.value = await getAllTipoviNaloga()
}

const novoKlik = () => {
  editId.value = null
  form.value = {
    uloga_id: null,
    tip_naloga_id: null,
    kreirao_korisnik_id: null,
    naziv: '',
    sadrzaj: '',
    rok_zavrsetka: ''
  }
}

const rowKlik = (_, row) => {
  editId.value = row.id
  form.value = {
    uloga_id: row.uloga_id,
    tip_naloga_id: row.tip_naloga_id,
    kreirao_korisnik_id: row.kreirao_korisnik_id,
    naziv: row.naziv,
    sadrzaj: row.sadrzaj,
    rok_zavrsetka: row.rok_zavrsetka
  }
}

const spremiNalog = async () => {
  const kreirao_korisnik_id = JSON.parse(localStorage.getItem('user'))?.id || 1
  
  const nalogData = {
    uloga_id: form.value.uloga_id?.id || form.value.uloga_id,
    tip_naloga_id: form.value.tip_naloga_id?.id || form.value.tip_naloga_id,
    kreirao_korisnik_id,
    naziv: form.value.naziv,
    sadrzaj: form.value.sadrzaj,
    rok_zavrsetka: form.value.rok_zavrsetka
  }
  
  if (!editId.value) {
    await createNalog(nalogData)
  } else {
    await updateNalog(editId.value, nalogData)
  }
  await ucitajNaloze()
  novoKlik()
}



const obrisiNalog = async () => {
  if (!editId.value) return
  await deleteNalog(editId.value)
  await ucitajNaloze()
  novoKlik()
}

onMounted(async () => {
  await Promise.all([ucitajNaloze(), ucitajUloge(), ucitajTipoveNaloga()])
})

</script>
