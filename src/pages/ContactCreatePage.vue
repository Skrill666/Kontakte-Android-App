<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton default-href="/contacts" text="Zurück" />
        </IonButtons>
        <IonTitle>Kontakt hinzufügen</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent :fullscreen="true">
      <ContactForm
        v-model="form"
        :errors="errors"
        :submitting="isCreating"
        @submit="save"
        @cancel="cancel"
      />
      <DiscardChangesAlert
        :is-open="showDiscardDialog"
        @stay="resolveNavigation(false)"
        @discard="resolveNavigation(true)"
      />
    </IonContent>
  </IonPage>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
} from '@ionic/vue';
import { storeToRefs } from 'pinia';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import ContactForm from '@/components/contacts/ContactForm.vue';
import DiscardChangesAlert from '@/components/dialogs/DiscardChangesAlert.vue';
import { useAppMessages } from '@/composables/useAppMessages';
import { asAppError } from '@/domain/errors/AppError';
import type { CreateContactInput } from '@/domain/models/CreateContactInput';
import { validateContact, type ContactFormErrors } from '@/domain/validation/contactValidator';
import { useContactsStore } from '@/stores/contactsStore';

const router = useRouter();
const store = useContactsStore();
const { isCreating } = storeToRefs(store);
const messages = useAppMessages();
const form = ref<CreateContactInput>({
  givenName: '', familyName: '', phoneNumber: '', emailAddress: '', birthday: '',
});
const errors = ref<ContactFormErrors>({});
const showDiscardDialog = ref(false);
const allowNavigation = ref(false);
let pendingNavigation: ((allowed: boolean) => void) | null = null;

const isDirty = computed(() => Object.values(form.value).some((value) => value.trim().length > 0));

const save = async (): Promise<void> => {
  const result = validateContact(form.value);
  errors.value = result.errors;
  if (!result.isValid) return;
  try {
    await store.createContact(result.normalized);
    allowNavigation.value = true;
    await messages.showSuccess('Kontakt gespeichert.');
    await router.replace('/contacts');
  } catch (error) {
    const appError = asAppError(error, 'CONTACT_CREATE_FAILED', 'Der Kontakt konnte nicht gespeichert werden.');
    await messages.showError(appError.message);
  }
};
const cancel = (): void => { void router.back(); };
const resolveNavigation = (allowed: boolean): void => {
  showDiscardDialog.value = false;
  if (allowed) allowNavigation.value = true;
  pendingNavigation?.(allowed);
  pendingNavigation = null;
};

onBeforeRouteLeave(() => {
  if (allowNavigation.value || !isDirty.value) return true;
  showDiscardDialog.value = true;
  return new Promise<boolean>((resolve) => { pendingNavigation = resolve; });
});
</script>
