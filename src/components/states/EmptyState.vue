<template>
  <div class="state-container" role="status">
    <IonIcon :icon="peopleOutline" class="state-icon" aria-hidden="true" />
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
    <IonButton v-if="actionLabel" fill="outline" @click="$emit('action')">
      {{ actionLabel }}
    </IonButton>
  </div>
</template>
<script setup lang="ts">
import { IonButton, IonIcon } from '@ionic/vue';
import { peopleOutline } from 'ionicons/icons';
defineProps<{ title: string; message: string; actionLabel?: string }>();
defineEmits<{ action: [] }>();
</script>
