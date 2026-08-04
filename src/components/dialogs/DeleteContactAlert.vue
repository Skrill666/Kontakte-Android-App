<template>
  <IonAlert
    :is-open="isOpen"
    header="Kontakt löschen?"
    :message="`Soll „${contactName}“ dauerhaft vom Gerät gelöscht werden?`"
    :buttons="buttons"
    @didDismiss="$emit('cancel')"
  />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { IonAlert } from '@ionic/vue';
const props = defineProps<{ isOpen: boolean; contactName: string }>();
const emit = defineEmits<{ confirm: []; cancel: [] }>();
const buttons = computed(() => [
  { text: 'Abbrechen', role: 'cancel' },
  { text: 'Löschen', role: 'destructive', handler: () => emit('confirm') },
]);
</script>
