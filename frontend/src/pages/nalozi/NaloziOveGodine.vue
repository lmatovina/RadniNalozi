<template>
  <q-page padding>
    <div class="text-h5 q-mb-lg">Nalozi ove godine</div>

    <q-table
      :rows="nalozi"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      @request="onRequest"
      flat bordered dense
      bottom-slots
    >
      <template v-slot:body-cell-rok_zavrsetka="props">
        <q-td :props="props">
          {{ new Date(props.row.rok_zavrsetka).toLocaleDateString() }}
        </q-td>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="statusColor(props.row.status)">
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

const columns = [
  { name: "naziv", label: "Naziv", field: "naziv", sortable: true },
  { name: "rok_zavrsetka", label: "Rok", field: "rok_zavrsetka", sortable: true },
  { name: "status", label: "Status", field: "status", sortable: true },
  { name: "sadrzaj", label: "Sadrzaj", field: "sadrzaj", sortable: true },
];

const nalozi = ref([]);
const pagination = ref({
  page: 1,
  rowsPerPage: 3,
  rowsNumber: 0
});

const statusColor = (status) => {
  switch (status) {
    case "Otvoren": return "primary";
    case "U tijeku": return "orange";
    case "Zatvoren": return "green";
    case "Arhiviran": return "grey";
    default: return "blue";
  }
};


const loadNalozi = async () => {
  try {
    const { page, rowsPerPage } = pagination.value;

    const result = await getNaloziByYear(page, rowsPerPage);
    console.log("RESULT FROM BACKEND:", result);

    nalozi.value = result.data || [];
    pagination.value.rowsNumber = Number(result.total) || 0;
    pagination.value.totalPages = Number(result.totalPages) || 0;

  } catch (err) {
    console.error(err);
    nalozi.value = [];
    pagination.value.rowsNumber = 0;
  }
};


const onRequest = (props) => {
  if (props && props.pagination) {
    Object.assign(pagination.value, props.pagination);
  }
  loadNalozi();
};

onMounted(loadNalozi);
</script>
