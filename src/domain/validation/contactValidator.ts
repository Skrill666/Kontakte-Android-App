import type { CreateContactInput } from '@/domain/models/CreateContactInput';
import { isValidBirthday } from './birthdayValidator';
import { isValidEmail } from './emailValidator';
import { isValidPhoneNumber } from './phoneValidator';

export interface ContactFormErrors {
  givenName?: string;
  familyName?: string;
  phoneNumber?: string;
  emailAddress?: string;
  birthday?: string;
  general?: string;
}

export interface ContactValidationResult {
  isValid: boolean;
  normalized: CreateContactInput;
  errors: ContactFormErrors;
}

export const normalizeContactInput = (input: CreateContactInput): CreateContactInput => ({
  givenName: input.givenName.trim(),
  familyName: input.familyName.trim(),
  phoneNumber: input.phoneNumber.trim(),
  emailAddress: input.emailAddress.trim(),
  birthday: input.birthday.trim(),
});

export const validateContact = (input: CreateContactInput): ContactValidationResult => {
  const normalized = normalizeContactInput(input);
  const errors: ContactFormErrors = {};

  if (normalized.givenName.length > 100) {
    errors.givenName = 'Der Vorname darf höchstens 100 Zeichen enthalten.';
  }
  if (normalized.familyName.length > 100) {
    errors.familyName = 'Der Nachname darf höchstens 100 Zeichen enthalten.';
  }
  if (!isValidPhoneNumber(normalized.phoneNumber)) {
    errors.phoneNumber = 'Bitte eine gültige Telefonnummer eingeben.';
  }
  if (!isValidEmail(normalized.emailAddress)) {
    errors.emailAddress = 'Bitte eine gültige E-Mail-Adresse eingeben.';
  }
  if (!isValidBirthday(normalized.birthday)) {
    errors.birthday = 'Bitte ein gültiges Geburtsdatum auswählen.';
  }

  const hasIdentityOrContactValue = Boolean(
    normalized.givenName ||
      normalized.familyName ||
      normalized.phoneNumber ||
      normalized.emailAddress,
  );
  if (!hasIdentityOrContactValue) {
    errors.general = 'Bitte mindestens einen Namen, eine Telefonnummer oder eine E-Mail-Adresse eingeben.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    normalized,
    errors,
  };
};
