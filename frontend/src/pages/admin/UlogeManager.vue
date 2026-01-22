<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h4">
        <q-icon name="group_add" /> Upravljanje Ulogama (Timovima)
      </div>
      <q-btn 
        color="primary" 
        label="Kreiraj Novu Ulogu" 
        @click="showCreateDialog = true"
        icon="add_circle"
      />
    </div>

    <q-table
      :rows="uloge"
      :columns="columns"
      row-key="id"
      :loading="loading"
      no-data-label="Nema definiranih uloga"
      class="shadow-2"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <div class="q-gutter-xs">
            <q-btn 
              color="info" 
              icon="edit" 
              label="Uredi" 
              size="sm"
              @click="openEditDialog(props.row)"
            />
            <q-btn 
              color="negative" 
              icon="delete" 
              label="Obriši" 
              size="sm"
              @click="deleteUloga(props.row)"
              :loading="props.row.isDeleting"
            />
          </div>
        </q-td>
      </template>
    </q-table>
    
    <q-dialog v-model="showCreateDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Kreiranje Nove Uloge (Tima)</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="handleCreateUloga">
            
            <q-input 
              filled 
              v-model="newUloga.naziv" 
              label="Naziv Uloge *" 
              lazy-rules
              :rules="[val => !!val || 'Naziv je obavezan']"
              class="q-mb-sm"
            />
            
            <q-input 
              filled 
              v-model="newUloga.opis" 
              label="Opis Uloge (opcionalno)" 
              type="textarea"
              rows="3"
              class="q-mb-sm"
            />

            <q-select
              filled
              v-model="selectedUserIds"
              :options="userOptions"
              label="Dodijeli članove u ulogu (Korisnici)"
              multiple
              use-chips
              option-value="value"
              option-label="label"
              emit-value
              map-options
              hint="Unesite barem 2 slova za pretragu korisnika po imenu/prezimenu/emailu."
              use-input
              @filter="filterUsers"
              hide-selected
              fill-input
              input-debounce="500"
              class="q-mt-md"
              @update:model-value="updateSelectedUsersList"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Unesite barem 2 slova za početak pretrage.
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <!-- Lista odabranih korisnika -->
            <div v-if="selectedUsersList.length > 0" class="q-mt-md">
              <div class="text-subtitle2 q-mb-sm text-primary">
                <q-icon name="people" size="sm" class="q-mr-xs" />
                Odabrani članovi tima ({{ selectedUsersList.length }})
              </div>
              
              <div class="row q-col-gutter-sm">
                <div 
                  v-for="user in selectedUsersList" 
                  :key="user.value"
                  class="col-12 col-sm-6"
                >
                  <q-card flat bordered class="bg-grey-1">
                    <q-card-section class="q-pa-sm">
                      <div class="row items-center">
                        <div class="col">
                          <div class="text-weight-medium">{{ user.ime }} {{ user.prezime }}</div>
                          <div class="text-caption text-grey">{{ user.email }}</div>
                        </div>
                        <div class="col-auto">
                          <q-btn 
                            icon="close" 
                            size="xs" 
                            flat 
                            round 
                            dense
                            color="negative"
                            @click="removeSelectedUser(user.value)"
                          />
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>

            <div v-else class="text-grey q-mt-md text-center q-py-md">
              <q-icon name="info" size="sm" class="q-mr-xs" />
              Nema odabranih korisnika. Pretražite i odaberite korisnike iznad.
            </div>

            <q-card-actions align="right" class="text-primary q-mt-lg">
              <q-btn flat label="Odustani" v-close-popup color="negative" />
              <q-btn label="Kreiraj Ulogu" type="submit" color="primary" :loading="isSaving" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showEditDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Uređivanje uloge: {{ currentUloga.naziv }} (ID: {{ currentUloga.id }})</div>
          <div class="text-caption">Brisanje članova tima</div>
        </q-card-section>
        
        <q-card-section class="q-pt-none">
          <div v-if="currentUloga.members.length === 0" class="text-center text-grey q-py-lg">
            Uloga trenutno nema članova.
          </div>
          <q-list v-else bordered separator>
            <q-item v-for="member in currentUloga.members" :key="member.id">
              <q-item-section>
                {{ member.ime }} {{ member.prezime }} ({{ member.email }})
              </q-item-section>
              <q-item-section side>
                <q-btn 
                  icon="delete" 
                  color="negative" 
                  size="sm" 
                  flat
                  round
                  @click="removeMember(currentUloga.id, member.id, member.ime, member.prezime)"
                  :loading="member.isDeleting"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-separator class="q-my-md" />

<div class="text-subtitle2 text-primary q-mb-sm">
  <q-icon name="person_add" size="sm" class="q-mr-xs" />
  Dodaj nove članove
</div>

<q-select
  filled
  v-model="selectedUserIds"
  :options="userOptions"
  label="Dodijeli nove korisnike"
  multiple
  use-chips
  option-value="value"
  option-label="label"
  emit-value
  map-options
  use-input
  hide-selected
  fill-input
  input-debounce="500"
  @filter="filterUsers"
  @update:model-value="updateSelectedUsersList"
/>

<div v-if="selectedUsersList.length > 0" class="q-mt-md">
  <div class="row q-col-gutter-sm">
    <div
      v-for="user in selectedUsersList"
      :key="user.value"
      class="col-12 col-sm-6"
    >
      <q-card flat bordered>
        <q-card-section class="q-pa-sm row items-center">
          <div class="col">
            <div class="text-weight-medium">
              {{ user.ime }} {{ user.prezime }}
            </div>
            <div class="text-caption text-grey">
              {{ user.email }}
            </div>
          </div>
          <div class="col-auto">
            <q-btn
              icon="close"
              flat
              round
              dense
              size="xs"
              color="negative"
              @click="removeSelectedUser(user.value)"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</div>

<q-btn
  class="q-mt-md"
  color="primary"
  label="Dodaj članove"
  icon="group_add"
  :disable="selectedUserIds.length === 0"
  @click="addMembersToUloga"
/>
        
        <q-card-actions align="right">
          <q-btn flat label="Zatvori" v-close-popup color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import * as KorisniciService from '../../services/korisniciService.js'; 
import * as UlogeService from '../../services/ulogeService.js';

export default defineComponent({
  name: 'UlogeManager',
  setup() {
    const $q = useQuasar();
    const uloge = ref([]);
    const loading = ref(false);
    const showCreateDialog = ref(false);
    const showEditDialog = ref(false);
    const isSaving = ref(false);
    
    // Podaci za kreiranje uloge
    const userOptions = ref([]); 
    const newUloga = ref({ naziv: '', opis: '' });
    const selectedUserIds = ref([]); 
    const selectedUsersList = ref([]);

    // Podaci za uređivanje uloge
    const currentUloga = ref({ id: null, naziv: '', members: [] });

    const columns = [
      { name: 'naziv', align: 'left', label: 'Naziv Uloge', field: 'naziv', sortable: true },
      { name: 'opis', align: 'left', label: 'Opis', field: 'opis', sortable: true },
      { name: 'kreirao_korisnik_id', align: 'center', label: 'Kreirao (ID)', field: 'kreirao_korisnik_id', sortable: true },
      { name: 'actions', align: 'center', label: 'Akcije' },
    ];

    const filterUsers = async (val, update) => {
      if (val.length < 2) {
        update(() => {
          userOptions.value = [];
        });
        return;
      }

      try {
        const korisniciData = await KorisniciService.searchKorisnici(val);
        
        update(() => {
          userOptions.value = korisniciData.map(k => ({
            label: `${k.ime} ${k.prezime} (${k.email})`,
            value: k.id,
            ime: k.ime,
            prezime: k.prezime,
            email: k.email
          }));
        });
      } catch (error) {
        console.error('Greška pri pretrazi korisnika:', error);
        update(() => {
          userOptions.value = [];
        });
        
        $q.notify({
          type: 'negative',
          message: 'Greška pri pretrazi korisnika',
          timeout: 3000
        });
      }
    };

    // Funkcija za ažuriranje liste odabranih korisnika
    const updateSelectedUsersList = (selectedIds) => {
      if (!selectedIds || !Array.isArray(selectedIds)) {
        selectedUsersList.value = [];
        return;
      }
      
      const selectedUsers = [];
      
      selectedIds.forEach(id => {
        const userFromOptions = userOptions.value.find(u => u.value === id);
        
        if (userFromOptions) {
          selectedUsers.push(userFromOptions);
        } else {
          const existingUser = selectedUsersList.value.find(u => u.value === id);
          if (existingUser) {
            selectedUsers.push(existingUser);
          } else {
            selectedUsers.push({
              value: id,
              ime: "Nepoznato",
              prezime: "Korisnik",
              email: `ID: ${id}`
            });
          }
        }
      });
      
      selectedUsersList.value = selectedUsers;
    };

    // Funkcija za uklanjanje korisnika iz liste
    const removeSelectedUser = (userId) => {
      console.log("Uklanjam korisnika ID:", userId);
      
      selectedUserIds.value = selectedUserIds.value.filter(id => id !== userId);
      updateSelectedUsersList(selectedUserIds.value);
      
      $q.notify({
        type: 'info',
        message: 'Korisnik uklonjen iz odabira',
        timeout: 2000
      });
    };

    const fetchUloge = async () => {
      loading.value = true;
      try {
        uloge.value = await UlogeService.getAllUloge();
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Greška pri dohvaćanju uloga.',
          caption: error.response?.data?.error || 'Došlo je do greške na serveru.'
        });
      } finally {
        loading.value = false;
      }
    };

    const fetchUlogaDetails = async (ulogaId) => {
      try {
        const membersData = await UlogeService.getUlogaMembers(ulogaId);
        
        return {
          id: ulogaId,
          members: membersData.map(m => ({ ...m, isDeleting: false })),
        };
      } catch (error) {
        console.error('Greška pri dohvaćanju detalja uloge:', error);
        $q.notify({ type: 'negative', message: 'Greška pri dohvaćanju članova uloge.' });
        return { id: ulogaId, members: [] };
      }
    };

    const openEditDialog = async (uloga) => {
        selectedUserIds.value = [];
        selectedUsersList.value = [];
        userOptions.value = [];

      showEditDialog.value = true;
      currentUloga.value.id = uloga.id;
      currentUloga.value.naziv = uloga.naziv;
      
      const details = await fetchUlogaDetails(uloga.id);
      currentUloga.value.members = details.members;
    };
    
    const removeMember = async (ulogaId, korisnikId, ime, prezime) => {
      $q.dialog({
        title: 'Potvrda brisanja člana',
        message: `Jeste li sigurni da želite ukloniti ${ime} ${prezime} iz uloge "${currentUloga.value.naziv}"?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        const member = currentUloga.value.members.find(m => m.id === korisnikId);
        if (member) member.isDeleting = true;

        try {
          await UlogeService.removeMemberFromUloga(ulogaId, korisnikId); 
          
          $q.notify({
            type: 'positive',
            message: `${ime} ${prezime} uspješno uklonjen/a.`,
          });
          
          currentUloga.value.members = currentUloga.value.members.filter(m => m.id !== korisnikId);
          await fetchUloge(); 

        } catch (error) {
          $q.notify({
            type: 'negative',
            message: 'Greška pri uklanjanju člana.',
            caption: error.response?.data?.error || 'Provjerite je li backend ruta implementirana.'
          });
        } finally {
          if (member) member.isDeleting = false;
        }
      });
    };

    // NOVO: Funkcija za brisanje cijele uloge
    const deleteUloga = async (uloga) => {
      $q.dialog({
        title: 'Potvrda brisanja uloge',
        message: `Jeste li sigurni da želite obrisati ulogu "${uloga.naziv}" (ID: ${uloga.id})? Ova akcija je nepovratna i uklonit će sve članove iz uloge.`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        // Dodajte loading stanje za ovu ulogu
        uloga.isDeleting = true;
        
        try {
          await UlogeService.deleteUloga(uloga.id);
          
          $q.notify({
            type: 'positive',
            message: `Uloga "${uloga.naziv}" uspješno obrisana.`,
            timeout: 3000
          });
          
          // Ponovno učitajte listu uloga
          await fetchUloge();
          
        } catch (error) {
          console.error('Greška pri brisanju uloge:', error);
          $q.notify({
            type: 'negative',
            message: 'Greška pri brisanju uloge.',
            caption: error.response?.data?.error || 'Došlo je do greške na serveru.'
          });
        } finally {
          uloga.isDeleting = false;
        }
      });
    };

    const handleCreateUloga = async () => {
      isSaving.value = true;
      try {
        const payload = {
          ...newUloga.value,
          korisnikIds: selectedUserIds.value 
        };

        console.log("📤 Šaljem payload:", payload);

        const novaUloga = await UlogeService.createUloga(payload);
        
        $q.notify({
          type: 'positive',
          message: `Uloga "${novaUloga.naziv}" uspješno kreirana.`,
        });
        
        await fetchUloge(); 
        showCreateDialog.value = false;

        // Reset forme
        newUloga.value = { naziv: '', opis: '' };
        selectedUserIds.value = [];
        selectedUsersList.value = [];
        userOptions.value = [];

      } catch (error) {
        console.error("Greška pri kreiranju uloge:", error);
        $q.notify({
          type: 'negative',
          message: 'Kreiranje uloge neuspješno.',
          caption: error.response?.data?.error || error.message || 'Došlo je do greške na serveru.'
        });
      } finally {
        isSaving.value = false;
      }
    };

const addMembersToUloga = async () => {
  try {
    await UlogeService.addMembersToUloga(
      currentUloga.value.id,
      selectedUserIds.value
    );

    $q.notify({
      type: 'positive',
      message: 'Korisnici uspješno dodani u ulogu.'
    });

    const details = await fetchUlogaDetails(currentUloga.value.id);
    currentUloga.value.members = details.members;

    selectedUserIds.value = [];
    selectedUsersList.value = [];
    userOptions.value = [];

    await fetchUloge();

  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Greška pri dodavanju članova.',
      caption: error.response?.data?.error || 'Greška na serveru.'
    });
  }
};


    onMounted(() => {
      fetchUloge();
    });

    return {
      uloge,
      columns,
      loading,
      showCreateDialog,
      showEditDialog,
      currentUloga,
      newUloga,
      isSaving,
      userOptions,
      selectedUserIds,
      selectedUsersList,
      handleCreateUloga,
      filterUsers,
      updateSelectedUsersList,
      removeSelectedUser,
      openEditDialog,
      removeMember,
      deleteUloga,
      addMembersToUloga 
    };
  }
});
</script>

<style scoped>
.dashboard-card {
  transition: transform 0.3s ease;
}
.dashboard-card:hover {
  transform: translateY(-5px);
}

/* Stil za gumbe u tablici */
.q-table-actions button {
  margin: 0 2px;
}
</style>