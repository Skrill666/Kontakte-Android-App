import { describe, expect, it } from 'vitest';
import { contactFixtures } from '../fixtures/contacts';
import { filterContactsByName } from '@/utils/contactFiltering';
describe('filterContactsByName', () => {
  it('findet Vor- und Nachnamen unabhängig von Großschreibung und Umlauten', () => {
    expect(filterContactsByName(contactFixtures, 'anne').map((c) => c.id)).toEqual(['4']);
    expect(filterContactsByName(contactFixtures, 'MÜLLER').map((c) => c.id)).toEqual(['4']);
  });
  it('liefert bei leerer Suche alle Kontakte', () => {
    expect(filterContactsByName(contactFixtures, '   ')).toHaveLength(contactFixtures.length);
  });
});
