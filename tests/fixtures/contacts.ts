import type { ContactSummary } from '@/domain/models/ContactSummary';
export const contactFixtures: ContactSummary[] = [
  { id: '1', givenName: 'Zoë', familyName: 'Zimmer', displayName: 'Zoë Zimmer', photoUrl: null },
  { id: '2', givenName: 'Anna', familyName: 'Ähren', displayName: 'Anna Ähren', photoUrl: null },
  { id: '3', givenName: '', familyName: 'Ohnevorname', displayName: 'Ohnevorname', photoUrl: null },
  { id: '4', givenName: 'Änne', familyName: 'Müller', displayName: 'Änne Müller', photoUrl: null },
];
