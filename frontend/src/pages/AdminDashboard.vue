<template>
  <q-page padding>

    <div class="text-h5 q-mb-lg">
      Admin Dashboard
    </div>


<div class="row q-col-gutter-lg">

  <div class="col-12 col-md-3">
    <q-card class="q-pa-md dashboard-card cursor-pointer" clickable v-ripple @click="go('ove-godine')">
      <div class="text-subtitle1">Nalozi ove godine</div>
    </q-card>
  </div>

  <div class="col-12 col-md-3">
    <q-card class="q-pa-md dashboard-card cursor-pointer" clickable v-ripple @click="go('nadolazeci')">
      <div class="text-subtitle1">Nadolazeći rokovi (30/60/90 dana)</div>
    </q-card>
  </div>

  <div class="col-12 col-md-3">
    <q-card class="q-pa-md dashboard-card cursor-pointer" clickable v-ripple @click="go('kasni')">
      <div class="text-subtitle1">Nalozi s kašnjenjem</div>
    </q-card>
  </div>

  <div class="col-12 col-md-3">
    <q-card class="q-pa-md dashboard-card cursor-pointer" clickable v-ripple @click="go('notifikacije-tjedan')">
      <div class="text-subtitle1">Notifikacije poslane ovaj tjedan</div>
    </q-card>
  </div>

    <div class="col-12 col-md-3">
    <q-card class="q-pa-md dashboard-card cursor-pointer" clickable v-ripple @click="go('admin-list')">
      <div class="text-subtitle1">Administracija korisnika</div>
    </q-card>
  </div>

  <div class="col-12 col-md-3">
        <q-card class="q-pa-md dashboard-card cursor-pointer" clickable v-ripple @click="go('uloge-manager')">
          <div class="text-subtitle1">Upravljanje ulogama (timovi)</div>
        </q-card>
    </div>

</div>



    <div class="q-mt-xl">
      <div class="text-h6 q-mb-md">Brze Akcije</div>

      <div class="row q-col-gutter-md">

        <div class="col-12 col-md-4">
          <q-btn
            color="primary"
            class="full-width"
            label="Dodaj kategoriju"
            @click="goToCategories"
          />
        </div>

        <div class="col-12 col-md-4">
          <q-btn
            color="primary"
            class="full-width"
            label="Dodaj naloge za godinu"
            @click="goToOrders"
          />
        </div>

        <div class="col-12 col-md-4">
          <q-btn
            color="primary"
            class="full-width"
            label="Postavi pravila notifikacija"
            @click="goToNotifications"
          />
        </div>



      </div>

      
    </div>

  </q-page>
</template>

<script setup>
//import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function goToCategories() {
  router.push('/kategorije')
}
function goToOrders() {
  router.push('/nalozi')
}
function goToNotifications() {
  router.push('/notifikacije-pravila')
}

 
function go(section) {
  if (section === 'notifikacije-tjedan') {
    router.push('/notifikacije/tjedan')
    return
  }

    if (section === 'admin-list') {
    router.push('/admin/admin-list')
    return
  }
 
  if (section === 'uloge-manager') {
    router.push('/admin/uloge-manager')
    return
  }

  router.push(`/nalozi/${section}`)
}

</script>   

<style scoped>
.dashboard-card {
  min-height: 140px;
}
</style>
