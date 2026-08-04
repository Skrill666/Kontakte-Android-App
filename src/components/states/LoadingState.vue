<template>
  <div class="state-container" role="status" aria-live="polite">
    <IonSpinner name="crescent" />
    <p>{{ message }}</p>
  </div>
</template>
<script setup lang="ts">
import { IonSpinner } from '@ionic/vue';
withDefaults(defineProps<{ message?: string }>(), { message: 'Kontakte werden geladen …' });
</script>
