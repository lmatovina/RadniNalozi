<template>
  <div class="fullscreen bg-grey-2 flex flex-center">
    <q-card class="q-pa-xl" style="width: 400px; max-width: 90%;">
      <q-card-section>
        <div class="text-h6 text-center">Prijava</div>
      </q-card-section>

      <q-card-section>
        <q-input
          filled
          v-model="email"
          label="Email"
          type="email"
          class="q-mb-md"
        />

        <q-input
          filled
          v-model="password"
          label="Lozinka"
          type="password"
          class="q-mb-md"
        />

        <q-btn
          label="Prijavi se"
          color="primary"
          class="full-width q-mt-md"
          @click="login"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

function login() {
  if (!email.value || !password.value) {
    alert("Unesite email i lozinku")
    return
  }

  // Ovdje ćeš kasnije raditi API poziv.
  console.log("Login pokušaj:", email.value, password.value)

  // Primjer uspjeha - redirect
  router.push('/home') // kasnije kreiramo "home" page
}
</script>
