<template>
  <IonCard class="permission-card" :color="blocking ? 'light' : undefined">
    <IonCardHeader>
      <IonCardTitle>Kontaktzugriff erforderlich</IonCardTitle>
    </IonCardHeader>
    <IonCardContent>
      <p>
        Die App benötigt Lesezugriff, um Kontakte anzuzeigen, und Schreibzugriff,
        um Kontakte anzulegen oder zu löschen. Die Daten bleiben auf dem Gerät.
      </p>
      <p v-if="isDenied">
        Die Berechtigung wurde abgelehnt. Öffne bei Bedarf die App-Einstellungen.
      </p>
      <div class="permission-actions">
        <IonButton @click="$emit('request')">Berechtigungen anfordern</IonButton>
        <IonButton v-if="isDenied" fill="outline" @click="$emit('settings')">
          Einstellungen öffnen
        </IonButton>
      </div>
    </IonCardContent>
  </IonCard>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/vue';
import type { ContactPermissionState } from '@/domain/models/ContactPermissionState';

const props = defineProps<{ permission: ContactPermissionState; blocking?: boolean }>();
defineEmits<{ request: []; settings: [] }>();
const isDenied = computed(
  () => props.permission.readContacts === 'denied' || props.permission.writeContacts === 'denied',
);
</script>
