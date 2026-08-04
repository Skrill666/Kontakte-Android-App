import type { ContactBirthday } from './ContactBirthday';
import type { ContactEmailAddress } from './ContactEmailAddress';
import type { ContactPhoneNumber } from './ContactPhoneNumber';
import type { ContactSummary } from './ContactSummary';

export interface ContactDetail extends ContactSummary {
  phoneNumbers: ContactPhoneNumber[];
  emailAddresses: ContactEmailAddress[];
  birthday: ContactBirthday | null;
}
