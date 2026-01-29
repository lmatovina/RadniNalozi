<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Radni Nalozi </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list padding>

      <q-item clickable v-ripple to="/admin" v-if="isSupervizor">
      <q-item-section avatar>
        <q-icon name="dashboard" />
      </q-item-section>
      <q-item-section>Dashboard</q-item-section>
    </q-item>

        <q-item clickable v-ripple to="/nalozi">
          <q-item-section avatar>
            <q-icon name="assignment" />
          </q-item-section>
          <q-item-section>Nalozi</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/kategorije" v-if="isSupervizor">
          <q-item-section avatar>
            <q-icon name="category" />
          </q-item-section>
          <q-item-section>Kategorije</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/notifikacije-pravila" v-if="isSupervizor">
          <q-item-section avatar>
            <q-icon name="notifications" />
          </q-item-section>
          <q-item-section>Notifikacije</q-item-section>
        </q-item>¸

        <q-item clickable v-ripple to="/profil">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>Profil</q-item-section>
        </q-item>

        <q-item @click="logout" clickable v-ripple to="/">
          <q-item-section avatar>
            <q-icon name="logout" color="red" />
          </q-item-section>
          <q-item-section>Log Out</q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import {  computed} from 'vue'
import { user, clearUser } from '../stores/userStore'

const logout = async () => {
  try{
    await clearUser();
  } catch(err){
    console.error(err);
  }
};



const isSupervizor = computed(() => user.value?.je_supervizor === 1)
</script>

