<template>
  <IonItem button detail @click="$emit('select', contact.id)">
    <ContactAvatar slot="start" :photo-url="contact.photoUrl" :display-name="contact.displayName" />
    <IonLabel>
      <h2>{{ contact.displayName }}</h2>
      <p v-if="contact.givenName || contact.familyName">
        {{ contact.givenName || '–' }} · {{ contact.familyName || '–' }}
      </p>
    </IonLabel>
  </IonItem>
</template>
<script setup lang="ts">
import { IonItem, IonLabel } from '@ionic/vue';
import type { ContactSummary } from '@/domain/models/ContactSummary';
import ContactAvatar from './ContactAvatar.vue';
defineProps<{ contact: ContactSummary }>();
defineEmits<{ select: [contactId: string] }>();
</script>
