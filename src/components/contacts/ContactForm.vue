<template>
  <form class="contact-form" @submit.prevent="$emit('submit')">
    <IonList inset>
      <IonItem>
        <IonInput label="Vorname" label-placement="stacked" autocomplete="given-name" :maxlength="100"
          :model-value="modelValue.givenName" @ionInput="update('givenName', $event)" />
      </IonItem>
      <IonNote v-if="errors.givenName" color="danger">{{ errors.givenName }}</IonNote>

      <IonItem>
        <IonInput label="Nachname" label-placement="stacked" autocomplete="family-name" :maxlength="100"
          :model-value="modelValue.familyName" @ionInput="update('familyName', $event)" />
      </IonItem>
      <IonNote v-if="errors.familyName" color="danger">{{ errors.familyName }}</IonNote>

      <IonItem>
        <IonInput label="Telefonnummer" label-placement="stacked" type="tel" inputmode="tel" autocomplete="tel"
          :model-value="modelValue.phoneNumber" @ionInput="update('phoneNumber', $event)" />
      </IonItem>
      <IonNote v-if="errors.phoneNumber" color="danger">{{ errors.phoneNumber }}</IonNote>

      <IonItem>
        <IonInput label="E-Mail-Adresse" label-placement="stacked" type="email" inputmode="email" autocomplete="email"
          :model-value="modelValue.emailAddress" @ionInput="update('emailAddress', $event)" />
      </IonItem>
      <IonNote v-if="errors.emailAddress" color="danger">{{ errors.emailAddress }}</IonNote>

      <IonItem>
        <IonInput label="Geburtstag" label-placement="stacked" type="date" :max="today"
          :model-value="modelValue.birthday" @ionInput="update('birthday', $event)" />
      </IonItem>
      <IonNote v-if="errors.birthday" color="danger">{{ errors.birthday }}</IonNote>
    </IonList>

    <IonNote v-if="errors.general" class="general-error" color="danger">{{ errors.general }}</IonNote>

    <div class="form-actions">
      <IonButton type="button" fill="outline" :disabled="submitting" @click="$emit('cancel')">Abbrechen</IonButton>
      <IonButton type="submit" :disabled="submitting">
        <IonSpinner v-if="submitting" slot="start" name="crescent" />
        Speichern
      </IonButton>
    </div>
  </form>
</template>
<script setup lang="ts">
import { IonButton, IonInput, IonItem, IonList, IonNote, IonSpinner } from '@ionic/vue';
import type { CreateContactInput } from '@/domain/models/CreateContactInput';
import type { ContactFormErrors } from '@/domain/validation/contactValidator';

const props = defineProps<{ modelValue: CreateContactInput; errors: ContactFormErrors; submitting: boolean }>();
const emit = defineEmits<{
  'update:modelValue': [value: CreateContactInput];
  submit: [];
  cancel: [];
}>();
const today = new Date().toISOString().slice(0, 10);
const update = (field: keyof CreateContactInput, event: CustomEvent<{ value?: string | null }>): void => {
  emit('update:modelValue', { ...props.modelValue, [field]: event.detail.value ?? '' });
};
</script>
