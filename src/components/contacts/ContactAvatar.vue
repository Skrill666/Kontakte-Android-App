<template>
  <IonAvatar class="contact-avatar">
    <img
      v-if="photoUrl && !imageFailed"
      :src="photoUrl"
      :alt="`Foto von ${displayName}`"
      @error="imageFailed = true"
    />
    <div v-else class="avatar-placeholder" :aria-label="`Kein Foto für ${displayName}`">
      <IonIcon :icon="personOutline" aria-hidden="true" />
    </div>
  </IonAvatar>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { IonAvatar, IonIcon } from '@ionic/vue';
import { personOutline } from 'ionicons/icons';
const props = defineProps<{ photoUrl: string | null; displayName: string }>();
const imageFailed = ref(false);
watch(() => props.photoUrl, () => { imageFailed.value = false; });
</script>
