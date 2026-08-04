<template>
  <section class="contact-header">
    <ContactAvatar :photo-url="contact.photoUrl" :display-name="contact.displayName" />
    <div>
      <h1>{{ contact.displayName }}</h1>
      <p>Vorname: {{ contact.givenName || 'Nicht angegeben' }}</p>
      <p>Nachname: {{ contact.familyName || 'Nicht angegeben' }}</p>
    </div>
  </section>
</template>
<script setup lang="ts">
import type { ContactDetail } from '@/domain/models/ContactDetail';
import ContactAvatar from './ContactAvatar.vue';
defineProps<{ contact: ContactDetail }>();
</script>
