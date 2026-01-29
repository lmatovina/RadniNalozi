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
    <q-card class="q-pa-md dashboard-card cursor-pointer" clickable v-ripple @click="go('zavrseni-kasno')">
      <div class="text-subtitle1">Nalozi završeni kasno</div>
    </q-card>
  </div>

  <div class="col-12 col-md-3">
    <q-card class="q-pa-md dashboard-card cursor-pointer" clickable v-ripple @click="go('notifikacije-tjedan')">
      <div class="text-subtitle1">Notifikacije poslane ovaj tjedan</div>
    </q-card>
  </div>
  <div class="col-12 col-md-3">
    <q-card class="q-pa-md dashboard-card cursor-pointer" clickable v-ripple @click="go('novi')">
      <div class="text-subtitle1">Kreiranje novih naloga</div>
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

    <div class="col-12 col-md-3">
    <q-card class="q-pa-md dashboard-card cursor-pointer" 
            clickable 
            v-ripple 
            @click="go('nova-godina')">
      <div class="row items-center">
        <q-icon name="calendar_today" color="primary" size="lg" class="q-mr-md" />
        <div>
          <div class="text-subtitle1">Otvaranje nove godine</div>
          <div class="text-caption text-grey-7">Kopiranje naloga u novu godinu</div>
        </div>
      </div>
    </q-card>
  </div>

</div>
  </q-page>
</template>

<script setup>
//import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()


 
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
  if (section === 'novi') {
    router.push('/nalozi/novi')
    return
  }
  if (section === 'ove-godine') {
    router.push('/nalozi/ove-godine')
    return
  }
  if (section === 'nadolazeci') {
    router.push('/nalozi/nadolazeci')
    return
  }
  if (section === 'kasni') {
    router.push('/nalozi/kasni')
    return
  }
  if (section === 'zavrseni-kasno') {
    router.push('/nalozi/zavrseni-kasni')
    return
  }


  if (section === 'nova-godina') {
  router.push('/admin/nova-godina')
  return
}

  //router.push(/nalozi/${section})
}

</script>   

<style scoped>
.dashboard-card {
  min-height: 140px;
}
</style>