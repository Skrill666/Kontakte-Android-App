import { describe, expect, it } from 'vitest';
import { contactFixtures } from '../fixtures/contacts';
import { sortContactsByGivenName } from '@/utils/contactSorting';
describe('sortContactsByGivenName', () => {
  it('sortiert nach Vornamen und stellt fehlende Vornamen ans Ende', () => {
    expect(sortContactsByGivenName(contactFixtures).map((c) => c.id)).toEqual(['2', '4', '1', '3']);
  });
});
