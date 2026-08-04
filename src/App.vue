<template>
  <IonApp>
    <IonRouterOutlet />
  </IonApp>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { App as CapacitorApp } from '@capacitor/app';
import type { PluginListenerHandle } from '@capacitor/core';
import { useContactsStore } from '@/stores/contactsStore';

const contactsStore = useContactsStore();
let appStateListener: PluginListenerHandle | undefined;

onMounted(async () => {
  appStateListener = await CapacitorApp.addListener('appStateChange', ({ isActive }: { isActive: boolean }) => {
    if (isActive) {
      void contactsStore.initialize(true);
    }
  });
});

onUnmounted(() => {
  void appStateListener?.remove();
});
</script>
