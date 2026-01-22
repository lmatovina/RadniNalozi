<template>
  <q-page padding class="flex flex-center">
    <q-card style="width: 400px; max-width: 90vw">
      <q-card-section>
        <div class="text-h6">
          <q-icon name="lock" class="q-mr-sm" />
          Promjena lozinke
        </div>
        <div class="text-caption text-grey">
          Unesite trenutnu i novu lozinku
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit="handleChangePassword" class="q-gutter-md">

          <q-input
            v-model="currentPassword"
            type="password"
            label="Trenutna lozinka"
            filled
            lazy-rules
            :rules="[val => !!val || 'Obavezno polje']"
          />

          <q-input
            v-model="newPassword"
            type="password"
            label="Nova lozinka"
            filled
            lazy-rules
            :rules="[
              val => !!val || 'Obavezno polje',
              val => val.length >= 8 || 'Minimalno 8 znakova'
            ]"
          />

          <q-input
            v-model="confirmPassword"
            type="password"
            label="Potvrda nove lozinke"
            filled
            lazy-rules
            :rules="[
              val => !!val || 'Obavezno polje',
              val => val === newPassword || 'Lozinke se ne podudaraju'
            ]"
          />

          <q-btn
            label="Promijeni lozinku"
            type="submit"
            color="primary"
            class="full-width"
            :loading="loading"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";

import * as KorisniciService from "src/services/korisniciService";


export default defineComponent({
  name: "ChangePassword",

  setup() {
    const $q = useQuasar();

    const currentPassword = ref("");
    const newPassword = ref("");
    const confirmPassword = ref("");
    const loading = ref(false);

    const handleChangePassword = async () => {
      if (newPassword.value !== confirmPassword.value) {
        $q.notify({
          type: "negative",
          message: "Lozinke se ne podudaraju."
        });
        return;
      }

      loading.value = true;

      try {
        await KorisniciService.changePassword({
          currentPassword: currentPassword.value,
          newPassword: newPassword.value
        });

        $q.notify({
          type: "positive",
          message: "Lozinka uspješno promijenjena."
        });

        currentPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";

      } catch (error) {
        $q.notify({
          type: "negative",
          message:
            error.response?.data?.error ||
            "Greška pri promjeni lozinke."
        });
      } finally {
        loading.value = false;
      }
    };

    return {
      currentPassword,
      newPassword,
      confirmPassword,
      loading,
      handleChangePassword
    };
  }
});
</script>

<style scoped>
.q-card {
  border-radius: 12px;
}
</style>
