import { describe, expect, it } from 'vitest';
import type { Contact } from '@capawesome-team/capacitor-contacts';
import { mapNativeContactDetail } from '@/data/mappers/contactMapper';
describe('contactMapper', () => {
  it('bildet Mehrfachwerte, Geburtstag und Foto ab', () => {
    const native = {
      id: '42', givenName: 'Ada', familyName: 'Lovelace', photo: 'YWJj',
      phoneNumbers: [{ value: '+49 123', type: 'MOBILE', isPrimary: true }],
      emailAddresses: [{ value: 'ada@example.org', type: 'HOME', isPrimary: true }],
      birthday: { day: 10, month: 12, year: 1815 },
    } as unknown as Contact;
    const mapped = mapNativeContactDetail(native);
    expect(mapped?.displayName).toBe('Ada Lovelace');
    expect(mapped?.phoneNumbers).toHaveLength(1);
    expect(mapped?.emailAddresses).toHaveLength(1);
    expect(mapped?.photoUrl).toBe('data:image/jpeg;base64,YWJj');
    expect(mapped?.birthday?.year).toBe(1815);
  });
});
