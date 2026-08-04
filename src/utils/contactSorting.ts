import type { ContactSummary } from '@/domain/models/ContactSummary';

const collator = new Intl.Collator('de-DE', {
  sensitivity: 'base',
  numeric: true,
  ignorePunctuation: true,
});

export const sortContactsByGivenName = (contacts: ContactSummary[]): ContactSummary[] =>
  [...contacts].sort((left, right) => {
    const leftHasGivenName = left.givenName.trim().length > 0;
    const rightHasGivenName = right.givenName.trim().length > 0;

    if (leftHasGivenName !== rightHasGivenName) {
      return leftHasGivenName ? -1 : 1;
    }

    const givenNameComparison = collator.compare(left.givenName, right.givenName);
    if (givenNameComparison !== 0) {
      return givenNameComparison;
    }

    const familyNameComparison = collator.compare(left.familyName, right.familyName);
    return familyNameComparison !== 0
      ? familyNameComparison
      : collator.compare(left.displayName, right.displayName);
  });
