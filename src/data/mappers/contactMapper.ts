import type { Contact as NativeContact } from '@capawesome-team/capacitor-contacts';
import type { ContactBirthday } from '@/domain/models/ContactBirthday';
import type { ContactDetail } from '@/domain/models/ContactDetail';
import type { ContactEmailAddress } from '@/domain/models/ContactEmailAddress';
import type { ContactPhoneNumber } from '@/domain/models/ContactPhoneNumber';
import type { ContactSummary } from '@/domain/models/ContactSummary';
import { buildDisplayName, formatTypeLabel } from '@/utils/contactFormatting';

const text = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

export const photoToDataUrl = (photo: unknown): string | null => {
  const value = text(photo);
  if (!value) {
    return null;
  }
  return value.startsWith('data:image/') ? value : `data:image/jpeg;base64,${value}`;
};

const mapBirthday = (birthday: NativeContact['birthday'] | null | undefined): ContactBirthday | null => {
  if (!birthday || !birthday.day || !birthday.month) {
    return null;
  }
  return {
    day: birthday.day,
    month: birthday.month,
    year: birthday.year || null,
  };
};

const mapPhoneNumbers = (
  phoneNumbers: NativeContact['phoneNumbers'] | undefined,
): ContactPhoneNumber[] =>
  (phoneNumbers ?? [])
    .map((phone) => ({
      value: text(phone.value),
      label: formatTypeLabel(phone.type, phone.label),
      isPrimary: Boolean(phone.isPrimary),
    }))
    .filter((phone) => phone.value.length > 0);

const mapEmailAddresses = (
  emailAddresses: NativeContact['emailAddresses'] | undefined,
): ContactEmailAddress[] =>
  (emailAddresses ?? [])
    .map((email) => ({
      value: text(email.value),
      label: formatTypeLabel(email.type, email.label),
      isPrimary: Boolean(email.isPrimary),
    }))
    .filter((email) => email.value.length > 0);

export const mapNativeContactSummary = (contact: NativeContact): ContactSummary | null => {
  const id = text(contact.id);
  if (!id) {
    return null;
  }

  const givenName = text(contact.givenName);
  const familyName = text(contact.familyName);
  return {
    id,
    givenName,
    familyName,
    displayName: buildDisplayName(givenName, familyName),
    photoUrl: photoToDataUrl(contact.photo),
  };
};

export const mapNativeContactDetail = (contact: NativeContact): ContactDetail | null => {
  const summary = mapNativeContactSummary(contact);
  if (!summary) {
    return null;
  }

  return {
    ...summary,
    phoneNumbers: mapPhoneNumbers(contact.phoneNumbers),
    emailAddresses: mapEmailAddresses(contact.emailAddresses),
    birthday: mapBirthday(contact.birthday),
  };
};
