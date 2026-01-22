<template>
  <q-page padding>
    <div class="text-h5 q-mb-lg">Vaši nalozi</div>

    <q-table
      :rows="nalozi"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      @request="onRequest"
      :rows-per-page-options="[5, 10, 20, 50]"
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


      <template v-slot:body-cell-akcija="props">
        <q-td :props="props">
          <q-btn
            color="red"
            label="Zatvori"
            flat
            :disable="props.row.status === 'Zatvoren'"
            @click="confirmZatvori(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="showConfirm">
      <q-card>
        <q-card-section>
          Jeste li sigurni da želite zatvoriti ovaj nalog?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Odustani" v-close-popup />
          <q-btn flat label="Zatvori" color="red" @click="zatvoriNalog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>


<script setup>

import { ref, onMounted, computed } from "vue";
import { getKorisnikNalogById } from "../../services/naloziService";
import { user } from "../../stores/userStore";
import { updateZatvoriNalog } from "../../services/naloziService";

const userId = computed(() => user.value?.id);

const columns = [
  { name: "naziv", label: "Naziv", field: "naziv", sortable: true },
  { name: "rok_zavrsetka", label: "Rok", field: "rok_zavrsetka", sortable: true },
  { name: "status", label: "Status", field: "status", sortable: true },
  { name: "sadrzaj", label: "Sadrzaj", field: "sadrzaj", sortable: true },
    { name: "akcija", label: "Akcija", field: "akcija" },
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
    if (!userId.value) return;
    console.log("USER ID:", userId.value);

    const { page, rowsPerPage } = pagination.value;

    const result = await getKorisnikNalogById(
      userId.value,
      page,
      rowsPerPage
    );

    console.log("RESULT FROM BACKEND:", result);

    nalozi.value = result.data || [];
    pagination.value.rowsNumber = Number(result.total) || 0;
  } catch (err) {
    console.error(err);
    nalozi.value = [];
    pagination.value.rowsNumber = 0;
  }
};

const showConfirm = ref(false);
const confirmId = ref(null);

const confirmZatvori = (id) => {
  confirmId.value = id;
  showConfirm.value = true;
  console.log(confirmId.value)
};

const zatvoriNalog = async () => {
  try {
    console.log(confirmId.value)
    await updateZatvoriNalog(confirmId.value);
    showConfirm.value = false;
    loadNalozi();
  } catch (err) {
    console.error(err);
  }
};

const onRequest = (props) => {
  if (props && props.pagination) {
    Object.assign(pagination.value, props.pagination)
  }
  loadNalozi();
}

onMounted(loadNalozi);


</script>
