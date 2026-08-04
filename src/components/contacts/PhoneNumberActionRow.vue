<template>
  <IonItem>
    <IonLabel>
      <h3>{{ phone.value }}</h3>
      <p>{{ phone.label || 'Telefonnummer' }}<span v-if="phone.isPrimary"> · Primär</span></p>
    </IonLabel>
    <div slot="end" class="row-actions">
      <IonButton fill="clear" :aria-label="`${phone.value} in Telefon-App öffnen`" @click="$emit('dial', phone.value)">
        <IonIcon slot="icon-only" :icon="callOutline" />
      </IonButton>
      <IonButton fill="clear" :aria-label="`${phone.value} kopieren`" @click="$emit('copy', phone.value)">
        <IonIcon slot="icon-only" :icon="copyOutline" />
      </IonButton>
      <IonButton fill="clear" :aria-label="`SMS an ${phone.value} verfassen`" @click="$emit('sms', phone.value)">
        <IonIcon slot="icon-only" :icon="chatbubbleOutline" />
      </IonButton>
    </div>
  </IonItem>
</template>
<script setup lang="ts">
import { IonButton, IonIcon, IonItem, IonLabel } from '@ionic/vue';
import { callOutline, chatbubbleOutline, copyOutline } from 'ionicons/icons';
import type { ContactPhoneNumber } from '@/domain/models/ContactPhoneNumber';
defineProps<{ phone: ContactPhoneNumber }>();
defineEmits<{ dial: [value: string]; copy: [value: string]; sms: [value: string] }>();
</script>
