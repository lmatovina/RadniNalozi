<template>
  <q-page padding>
    <div class="text-h5 q-mb-lg">Nalozi ove godine</div>


    <q-table
      :rows="nalozi"
      :columns="columns"
      row-key="id"
      flat
      bordered
      dense
    >
      
      <template v-slot:body-cell-rok_zavrsetka="props">
        <q-td :props="props">
          {{ new Date(props.row.rok_zavrsetka).toLocaleDateString() }}
        </q-td>
      </template>


      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="statusColor(props.row.status)" align="center">
            {{ props.row.status }}
          </q-badge>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getNaloziByYear } from "../../services/naloziService.js";

const nalozi = ref([]);
const trenutnaGodina = new Date().getFullYear();

const columns = [
  { name: "naziv", label: "Naziv", field: "naziv", sortable: true },
  { name: "rok_zavrsetka", label: "Rok", field: "rok_zavrsetka", sortable: true },
  { name: "status", label: "Status", field: "status", sortable: true },
  { name: "sadrzaj", label: "Sadrzaj", field: "sadrzaj", sortable: true },
];

const loadNaloziByYear = async () => {
  try {
    nalozi.value = await getNaloziByYear(trenutnaGodina);
  } catch (err) {
    console.error("Greška pri filtriranju po godini:", err);
  }
};

const statusColor = (status) => {
  switch (status) {
    case "Otvoren": return "primary";
    case "U tijeku": return "orange";
    case "Zatvoren": return "green";
    case "Arhiviran": return "grey";
    default: return "blue";
  }
};

onMounted(loadNaloziByYear);
</script>
