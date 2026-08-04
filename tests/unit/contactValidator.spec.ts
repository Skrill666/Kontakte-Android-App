import { describe, expect, it } from 'vitest';
import { validateContact } from '@/domain/validation/contactValidator';
const base = { givenName: '', familyName: '', phoneNumber: '', emailAddress: '', birthday: '' };
describe('validateContact', () => {
  it('verhindert vollständig leere Kontakte', () => {
    const result = validateContact(base);
    expect(result.isValid).toBe(false);
    expect(result.errors.general).toBeDefined();
  });
  it('trimmt und akzeptiert einen Kontakt mit Namen', () => {
    const result = validateContact({ ...base, givenName: '  Max  ' });
    expect(result.isValid).toBe(true);
    expect(result.normalized.givenName).toBe('Max');
  });
  it('erkennt ungültige E-Mail, Telefonnummer und zukünftiges Datum', () => {
    const result = validateContact({ ...base, givenName: 'Max', emailAddress: 'x', phoneNumber: '12', birthday: '2999-01-01' });
    expect(result.errors.emailAddress).toBeDefined();
    expect(result.errors.phoneNumber).toBeDefined();
    expect(result.errors.birthday).toBeDefined();
  });
});
