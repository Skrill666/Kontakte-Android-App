<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Kontakte</IonTitle>
        <IonButtons slot="end">
          <IonButton :disabled="!hasWriteAccess" aria-label="Kontakt hinzufügen" @click="openCreatePage">
            <IonIcon slot="icon-only" :icon="addOutline" />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>

    <IonContent :fullscreen="true">
      <PermissionState
        v-if="!hasReadAccess"
        :permission="permissionState"
        blocking
        @request="requestPermissions"
        @settings="openSettings"
      />

      <template v-else>
        <PermissionState
          v-if="!hasWriteAccess"
          :permission="permissionState"
          @request="requestPermissions"
          @settings="openSettings"
        />

        <IonRefresher slot="fixed" @ionRefresh="refresh">
          <IonRefresherContent pulling-text="Zum Aktualisieren ziehen" refreshing-spinner="crescent" />
        </IonRefresher>

        <IonSearchbar
          :model-value="searchQuery"
          placeholder="Kontakte durchsuchen"
          aria-label="Kontakte nach Namen durchsuchen"
          :debounce="100"
          @ionInput="onSearchInput"
          @ionClear="clearSearch"
        />

        <LoadingState v-if="loadState === 'loading'" />
        <ErrorState
          v-else-if="loadState === 'error'"
          :message="error?.message ?? 'Die Kontakte konnten nicht geladen werden.'"
          @retry="loadContacts"
        />
        <EmptyState
          v-else-if="contacts.length === 0"
          title="Keine Kontakte vorhanden"
          message="Auf diesem Gerät sind noch keine Kontakte gespeichert."
        />
        <EmptyState
          v-else-if="filteredContacts.length === 0"
          title="Keine passenden Kontakte"
          message="Für diesen Suchbegriff wurden keine Kontakte gefunden."
          action-label="Suche zurücksetzen"
          @action="clearSearch"
        />
        <IonList v-else>
          <ContactListItem
            v-for="contact in filteredContacts"
            :key="contact.id"
            :contact="contact"
            @select="openDetailPage"
          />
        </IonList>
      </template>
    </IonContent>
  </IonPage>
</template>
<script setup lang="ts">
import { onIonViewWillEnter } from '@ionic/vue';
import {
  IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonList, IonPage,
  IonRefresher, IonRefresherContent, IonSearchbar, IonTitle, IonToolbar,
} from '@ionic/vue';
import { addOutline } from 'ionicons/icons';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import ContactListItem from '@/components/contacts/ContactListItem.vue';
import EmptyState from '@/components/states/EmptyState.vue';
import ErrorState from '@/components/states/ErrorState.vue';
import LoadingState from '@/components/states/LoadingState.vue';
import PermissionState from '@/components/states/PermissionState.vue';
import { useContactsStore } from '@/stores/contactsStore';

const router = useRouter();
const store = useContactsStore();
const {
  contacts, filteredContacts, searchQuery, loadState, permissionState, error,
  hasReadAccess, hasWriteAccess,
} = storeToRefs(store);

onIonViewWillEnter(() => { void store.initialize(true); });

const onSearchInput = (event: CustomEvent<{ value?: string | null }>): void => {
  store.setSearchQuery(event.detail.value ?? '');
};
const requestPermissions = (): void => { void store.requestPermissions(); };
const openSettings = (): void => { void store.openSettings(); };
const loadContacts = (): void => { void store.loadContacts(); };
const clearSearch = (): void => store.clearSearch();
const openCreatePage = (): void => { void router.push({ name: 'contact-create' }); };
const openDetailPage = (contactId: string): void => {
  void router.push({ name: 'contact-detail', params: { contactId } });
};
const refresh = async (event: CustomEvent): Promise<void> => {
  await store.initialize(true);
  const target = event.target as HTMLIonRefresherElement;
  await target.complete();
};
</script>
