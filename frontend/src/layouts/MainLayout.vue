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

        <q-item clickable v-ripple to="/kategorije">
          <q-item-section avatar>
            <q-icon name="category" />
          </q-item-section>
          <q-item-section>Kategorije</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/notifikacije-pravila">
          <q-item-section avatar>
            <q-icon name="notifications" />
          </q-item-section>
          <q-item-section>Notifikacije</q-item-section>
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
import { user } from '../stores/userStore'



const isSupervizor = computed(() => user.value?.je_supervizor === 1)
</script>

