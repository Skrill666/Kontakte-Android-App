<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton default-href="/contacts" text="Zurück" />
        </IonButtons>
        <IonTitle>Kontaktdetails</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent :fullscreen="true">
      <LoadingState v-if="loadState === 'loading'" message="Kontakt wird geladen …" />
      <ErrorState v-else-if="loadState === 'error'" :message="errorMessage" @retry="loadContact" />
      <template v-else-if="contact">
        <ContactHeader :contact="contact" />

        <IonList inset>
          <IonListHeader><IonLabel>Telefonnummern</IonLabel></IonListHeader>
          <PhoneNumberActionRow
            v-for="(phone, index) in contact.phoneNumbers"
            :key="`${phone.value}-${index}`"
            :phone="phone"
            @dial="actions.openPhone"
            @copy="actions.copyPhone"
            @sms="actions.composeSms"
          />
          <IonItem v-if="contact.phoneNumbers.length === 0"><IonLabel color="medium">Nicht angegeben</IonLabel></IonItem>

          <IonListHeader><IonLabel>E-Mail-Adressen</IonLabel></IonListHeader>
          <EmailAddressActionRow
            v-for="(email, index) in contact.emailAddresses"
            :key="`${email.value}-${index}`"
            :email="email"
            @compose="actions.openEmail"
            @copy="actions.copyEmail"
          />
          <IonItem v-if="contact.emailAddresses.length === 0"><IonLabel color="medium">Nicht angegeben</IonLabel></IonItem>

          <IonListHeader><IonLabel>Geburtstag</IonLabel></IonListHeader>
          <IonItem><IonLabel>{{ formatBirthday(contact.birthday) }}</IonLabel></IonItem>
        </IonList>

        <div class="danger-zone">
          <IonButton color="danger" expand="block" :disabled="!hasWriteAccess || isDeleting" @click="showDeleteDialog = true">
            <IonSpinner v-if="isDeleting" slot="start" name="crescent" />
            Kontakt löschen
          </IonButton>
        </div>

        <DeleteContactAlert
          :is-open="showDeleteDialog"
          :contact-name="contact.displayName"
          @cancel="showDeleteDialog = false"
          @confirm="confirmDelete"
        />
      </template>
    </IonContent>
  </IonPage>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { onIonViewWillEnter } from '@ionic/vue';
import {
  IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel,
  IonList, IonListHeader, IonPage, IonSpinner, IonTitle, IonToolbar,
} from '@ionic/vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import ContactHeader from '@/components/contacts/ContactHeader.vue';
import EmailAddressActionRow from '@/components/contacts/EmailAddressActionRow.vue';
import PhoneNumberActionRow from '@/components/contacts/PhoneNumberActionRow.vue';
import DeleteContactAlert from '@/components/dialogs/DeleteContactAlert.vue';
import ErrorState from '@/components/states/ErrorState.vue';
import LoadingState from '@/components/states/LoadingState.vue';
import { useAppMessages } from '@/composables/useAppMessages';
import { useContactActions } from '@/composables/useContactActions';
import { asAppError } from '@/domain/errors/AppError';
import type { ContactDetail } from '@/domain/models/ContactDetail';
import type { LoadState } from '@/domain/models/LoadState';
import { useContactsStore } from '@/stores/contactsStore';
import { formatBirthday } from '@/utils/contactFormatting';

const route = useRoute();
const router = useRouter();
const store = useContactsStore();
const { hasWriteAccess, isDeleting } = storeToRefs(store);
const messages = useAppMessages();
const actions = useContactActions();
const contact = ref<ContactDetail | null>(null);
const loadState = ref<LoadState>('idle');
const errorMessage = ref('Der Kontakt konnte nicht geladen werden.');
const showDeleteDialog = ref(false);

const contactId = (): string => String(route.params.contactId ?? '');
const loadContact = async (): Promise<void> => {
  loadState.value = 'loading';
  try {
    await store.initialize();
    contact.value = await store.getContactById(contactId());
    if (!contact.value) {
      errorMessage.value = 'Der Kontakt ist nicht mehr vorhanden.';
      loadState.value = 'error';
      return;
    }
    loadState.value = 'success';
  } catch (error) {
    const appError = asAppError(error, 'CONTACTS_LOAD_FAILED', 'Der Kontakt konnte nicht geladen werden.');
    errorMessage.value = appError.message;
    loadState.value = 'error';
  }
};
const confirmDelete = async (): Promise<void> => {
  showDeleteDialog.value = false;
  if (!contact.value) return;
  try {
    await store.deleteContact(contact.value.id);
    await messages.showSuccess('Kontakt gelöscht.');
    await router.replace('/contacts');
  } catch (error) {
    const appError = asAppError(error, 'CONTACT_DELETE_FAILED', 'Der Kontakt konnte nicht gelöscht werden.');
    await messages.showError(appError.message);
  }
};
onIonViewWillEnter(() => { void loadContact(); });
</script>
