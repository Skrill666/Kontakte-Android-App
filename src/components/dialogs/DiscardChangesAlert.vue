<template>
  <IonAlert
    :is-open="isOpen"
    header="Eingaben verwerfen?"
    message="Die nicht gespeicherten Eingaben gehen verloren."
    :buttons="buttons"
    @didDismiss="$emit('stay')"
  />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { IonAlert } from '@ionic/vue';
const emit = defineEmits<{ discard: []; stay: [] }>();
defineProps<{ isOpen: boolean }>();
const buttons = computed(() => [
  { text: 'Weiter bearbeiten', role: 'cancel' },
  { text: 'Verwerfen', role: 'destructive', handler: () => emit('discard') },
]);
</script>
