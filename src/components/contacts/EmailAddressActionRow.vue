<template>
  <IonItem>
    <IonLabel>
      <h3>{{ email.value }}</h3>
      <p>{{ email.label || 'E-Mail-Adresse' }}<span v-if="email.isPrimary"> · Primär</span></p>
    </IonLabel>
    <div slot="end" class="row-actions">
      <IonButton fill="clear" :aria-label="`E-Mail an ${email.value} verfassen`" @click="$emit('compose', email.value)">
        <IonIcon slot="icon-only" :icon="mailOutline" />
      </IonButton>
      <IonButton fill="clear" :aria-label="`${email.value} kopieren`" @click="$emit('copy', email.value)">
        <IonIcon slot="icon-only" :icon="copyOutline" />
      </IonButton>
    </div>
  </IonItem>
</template>
<script setup lang="ts">
import { IonButton, IonIcon, IonItem, IonLabel } from '@ionic/vue';
import { copyOutline, mailOutline } from 'ionicons/icons';
import type { ContactEmailAddress } from '@/domain/models/ContactEmailAddress';
defineProps<{ email: ContactEmailAddress }>();
defineEmits<{ compose: [value: string]; copy: [value: string] }>();
</script>
