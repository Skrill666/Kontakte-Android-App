import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { setContactRepositoryForTests } from '@/data/repositories/contactRepositoryProvider';
import { useContactsStore } from '@/stores/contactsStore';
import { MockContactRepository } from '../mocks/MockContactRepository';
import { contactFixtures } from '../fixtures/contacts';
describe('contactsStore', () => {
  let repository: MockContactRepository;
  beforeEach(() => {
    setActivePinia(createPinia());
    repository = new MockContactRepository();
    repository.contacts = [...contactFixtures];
    setContactRepositoryForTests(repository);
  });
  it('lädt, sortiert und filtert Kontakte', async () => {
    const store = useContactsStore();
    await store.initialize();
    expect(store.sortedContacts[0]?.givenName).toBe('Anna');
    store.setSearchQuery('Müller');
    expect(store.filteredContacts.map((contact: (typeof contactFixtures)[number]) => contact.id)).toEqual(['4']);
  });
  it('zeigt ohne Leseberechtigung keine Kontakte', async () => {
    repository.permissions.readContacts = 'denied';
    const store = useContactsStore();
    await store.initialize();
    expect(store.contacts).toHaveLength(0);
    expect(store.hasReadAccess).toBe(false);
  });
});
