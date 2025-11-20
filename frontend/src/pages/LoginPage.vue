<template>
  <div class="fullscreen bg-grey-2 flex flex-center">
    <q-card class="q-pa-xl" style="width: 400px; max-width: 90%;">
      <q-card-section>
        <div class="text-h6 text-center">Prijava</div>
      </q-card-section>

      <q-card-section>
        <q-input filled v-model="email" label="Email" type="email" class="q-mb-md" />
        <q-input filled v-model="password" label="Lozinka" type="password" class="q-mb-md" />

        <q-btn label="Prijavi se" color="primary" class="full-width q-mt-md" @click="login" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import axios from 'axios'
import { setUser } from '../stores/userStore'

const email = ref('')
const password = ref('')
const router = useRouter()
const $q = useQuasar()

const login = async () => {
  if (!email.value || !password.value) {
    $q.notify({ type: 'negative', message: 'Unesite email i lozinku' })
    return
  }

  try {
    const res = await axios.post('http://localhost:3000/api/auth/login', {
      email: email.value,
      password: password.value
    })

    // reaktivno update-amo store
    setUser(res.data.user)
    localStorage.setItem('token', res.data.token)

    $q.notify({ type: 'positive', message: 'Uspješna prijava' })
    router.push('/home')
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.error || 'Greška pri prijavi' })
  }
}
</script>

