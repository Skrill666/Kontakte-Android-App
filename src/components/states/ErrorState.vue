<template>
  <div class="state-container" role="alert">
    <IonIcon :icon="alertCircleOutline" class="state-icon" aria-hidden="true" />
    <h2>Etwas ist schiefgelaufen</h2>
    <p>{{ message }}</p>
    <IonButton @click="$emit('retry')">Erneut versuchen</IonButton>
  </div>
</template>
<script setup lang="ts">
import { IonButton, IonIcon } from '@ionic/vue';
import { alertCircleOutline } from 'ionicons/icons';
defineProps<{ message: string }>();
defineEmits<{ retry: [] }>();
</script>
