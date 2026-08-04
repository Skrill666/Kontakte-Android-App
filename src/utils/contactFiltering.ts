import type { ContactSummary } from '@/domain/models/ContactSummary';

const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('de-DE')
    .trim();

export const filterContactsByName = (
  contacts: ContactSummary[],
  query: string,
): ContactSummary[] => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) {
    return contacts;
  }

  return contacts.filter((contact) => {
    const searchableName = normalize(
      `${contact.givenName} ${contact.familyName} ${contact.displayName}`,
    );
    return searchableName.includes(normalizedQuery);
  });
};
