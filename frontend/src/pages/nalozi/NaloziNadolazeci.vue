<template>
  <q-page padding>
    <div class="text-h5 q-mb-lg">Nadolazeći nalozi</div>

    <div class="row q-mb-md items-center">
      <div class="col-8">
        <q-input
          filled
          v-model.number="dani"
          type="number"
          label="Broj dana (npr. 30, 60, 90)"
        />
      </div>

      <div class="col-4">
        <q-btn
          color="primary"
          label="Učitaj"
          class="full-width"
          @click="onRequest"
        />
      </div>
    </div>

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
import { getNadolazeciNalozi } from "../../services/naloziService.js";
import { useQuasar } from "quasar";

const $q = useQuasar();

const nalozi = ref([]);
const dani = ref(30);

const columns = [
  { name: "naziv", label: "Naziv", field: "naziv", sortable: true },
  { name: "rok_zavrsetka", label: "Rok", field: "rok_zavrsetka", sortable: true },
  { name: "status", label: "Status", field: "status", sortable: true },
  { name: "sadrzaj", label: "Sadrzaj", field: "sadrzaj", sortable: true },
];

const statusColor = (status) => {
  switch (status) {
    case "Otvoren": return "primary";
    case "U tijeku": return "orange";
    case "Zatvoren": return "green";
    case "Arhiviran": return "grey";
    default: return "blue";
  }
};
const pagination = ref({
  page: 1,
  rowsPerPage: 2,
  rowsNumber: 0
});

const loadNadolazeciNalozi = async () => {
  try {
    if (!dani.value || dani.value <= 0) {
      $q.notify({
        type: "negative",
        message: "Broj dana nije ispravan",
      });
      return;
    }

    nalozi.value = [];  
    const { page, rowsPerPage } = pagination.value;
    const result = await getNadolazeciNalozi(dani.value, page, rowsPerPage);
    console.log("RESULT FROM BACKEND:", result);
    if (result.length === 0) {
      $q.notify({
        type: "info",
        message: "Nema naloga u ovom razdoblju",
      });
    }

    nalozi.value = result.data || [];
    console.log("RESULT FROM BACKEND:", nalozi.value);
    pagination.value.rowsNumber = Number(result.total) || 0;
    pagination.value.totalPages = Number(result.totalPages) || 0;
  pagination.value = { ...pagination.value };  } catch (err) {
    if (err.response && err.response.status === 404) {
      nalozi.value = [];
      $q.notify({
        type: "info",
        message: "Nema naloga u ovom razdoblju",
      });
    } else {
      $q.notify({
        type: "negative",
        message: "Greška pri učitavanju nadolazećih naloga",
      });
      console.error(err);
    }
  }
};

const onRequest = (props) => {
  if (props && props.pagination) {
    Object.assign(pagination.value, props.pagination);
  }
  loadNadolazeciNalozi();
};

onMounted(loadNadolazeciNalozi);

</script>
