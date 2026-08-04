import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { asAppError, type AppError } from '@/domain/errors/AppError';
import type { ContactDetail } from '@/domain/models/ContactDetail';
import {
  hasReadContactAccess,
  hasWriteContactAccess,
  initialContactPermissionState,
  type ContactPermissionState,
} from '@/domain/models/ContactPermissionState';
import type { ContactSummary } from '@/domain/models/ContactSummary';
import type { CreateContactInput } from '@/domain/models/CreateContactInput';
import type { LoadState } from '@/domain/models/LoadState';
import { getContactRepository } from '@/data/repositories/contactRepositoryProvider';
import { filterContactsByName } from '@/utils/contactFiltering';
import { sortContactsByGivenName } from '@/utils/contactSorting';

export const useContactsStore = defineStore('contacts', () => {
  const contacts = ref<ContactSummary[]>([]);
  const searchQuery = ref('');
  const loadState = ref<LoadState>('idle');
  const permissionState = ref<ContactPermissionState>(initialContactPermissionState());
  const error = ref<AppError | null>(null);
  const isCreating = ref(false);
  const isDeleting = ref(false);
  const initialized = ref(false);

  const hasReadAccess = computed(() => hasReadContactAccess(permissionState.value));
  const hasWriteAccess = computed(() => hasWriteContactAccess(permissionState.value));
  const sortedContacts = computed(() => sortContactsByGivenName(contacts.value));
  const filteredContacts = computed(() =>
    filterContactsByName(sortedContacts.value, searchQuery.value),
  );

  const checkPermissions = async (): Promise<ContactPermissionState> => {
    permissionState.value = await getContactRepository().checkPermissions();
    return permissionState.value;
  };

  const requestPermissions = async (): Promise<void> => {
    error.value = null;
    try {
      permissionState.value = await getContactRepository().requestPermissions();
      if (hasReadAccess.value) {
        await loadContacts();
      }
    } catch (caught) {
      error.value = asAppError(
        caught,
        'PERMISSION_DENIED',
        'Die Kontaktberechtigungen konnten nicht angefordert werden.',
      );
    }
  };

  const openSettings = async (): Promise<void> => {
    await getContactRepository().openSettings();
  };

  const loadContacts = async (): Promise<void> => {
    if (!hasReadAccess.value) {
      contacts.value = [];
      loadState.value = 'idle';
      return;
    }

    loadState.value = 'loading';
    error.value = null;
    try {
      contacts.value = await getContactRepository().getContacts();
      loadState.value = 'success';
    } catch (caught) {
      loadState.value = 'error';
      error.value = asAppError(
        caught,
        'CONTACTS_LOAD_FAILED',
        'Die Kontakte konnten nicht geladen werden.',
      );
    }
  };

  const initialize = async (force = false): Promise<void> => {
    if (initialized.value && !force) {
      return;
    }
    try {
      await checkPermissions();
      initialized.value = true;
      if (hasReadAccess.value) {
        await loadContacts();
      } else {
        contacts.value = [];
        loadState.value = 'idle';
      }
    } catch (caught) {
      error.value = asAppError(
        caught,
        'UNKNOWN_ERROR',
        'Die App konnte nicht initialisiert werden.',
      );
      loadState.value = 'error';
    }
  };

  const getContactById = async (contactId: string): Promise<ContactDetail | null> => {
    if (!hasReadAccess.value) {
      throw asAppError(
        new Error('Read permission missing'),
        'PERMISSION_DENIED',
        'Zum Anzeigen des Kontakts wird die Leseberechtigung benötigt.',
      );
    }
    return getContactRepository().getContactById(contactId);
  };

  const createContact = async (input: CreateContactInput): Promise<string> => {
    if (!hasWriteAccess.value) {
      throw asAppError(
        new Error('Write permission missing'),
        'PERMISSION_DENIED',
        'Zum Speichern wird die Schreibberechtigung benötigt.',
      );
    }
    isCreating.value = true;
    try {
      const id = await getContactRepository().createContact(input);
      await loadContacts();
      return id;
    } finally {
      isCreating.value = false;
    }
  };

  const deleteContact = async (contactId: string): Promise<void> => {
    if (!hasWriteAccess.value) {
      throw asAppError(
        new Error('Write permission missing'),
        'PERMISSION_DENIED',
        'Zum Löschen wird die Schreibberechtigung benötigt.',
      );
    }
    isDeleting.value = true;
    try {
      await getContactRepository().deleteContact(contactId);
      contacts.value = contacts.value.filter((contact) => contact.id !== contactId);
      await loadContacts();
    } finally {
      isDeleting.value = false;
    }
  };

  const setSearchQuery = (query: string): void => {
    searchQuery.value = query;
  };

  const clearSearch = (): void => {
    searchQuery.value = '';
  };

  const clearError = (): void => {
    error.value = null;
  };

  return {
    contacts,
    searchQuery,
    loadState,
    permissionState,
    error,
    isCreating,
    isDeleting,
    hasReadAccess,
    hasWriteAccess,
    sortedContacts,
    filteredContacts,
    initialize,
    checkPermissions,
    requestPermissions,
    openSettings,
    loadContacts,
    getContactById,
    createContact,
    deleteContact,
    setSearchQuery,
    clearSearch,
    clearError,
  };
});
