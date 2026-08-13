import {
  Contacts,
  EmailAddressType,
  PhoneNumberType,
  type Contact as NativeContact,
  type ContactField,
} from '@capawesome-team/capacitor-contacts';
import { AppError, asAppError } from '@/domain/errors/AppError';
import type { ContactDetail } from '@/domain/models/ContactDetail';
import type { ContactPermissionState } from '@/domain/models/ContactPermissionState';
import type { ContactSummary } from '@/domain/models/ContactSummary';
import type { CreateContactInput } from '@/domain/models/CreateContactInput';
import type { ContactRepository } from '@/domain/repositories/ContactRepository';
import { mapNativeContactDetail, mapNativeContactSummary } from '@/data/mappers/contactMapper';
import { ContactPermissionService } from '@/services/native/ContactPermissionService';
import { DefaultContactAccountService } from '@/services/native/DefaultContactAccountService';

const CONTACT_FIELDS: ContactField[] = [
  'id',
  'givenName',
  'familyName',
  'phoneNumbers',
  'emailAddresses',
  'birthday',
  'photo',
];

const PAGE_SIZE = 100;

const birthdayFromInput = (
  value: string,
): NativeContact['birthday'] | undefined => {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) {
    return undefined;
  }

  return {
    year,
    month,
    day,
  };
};

export class CapacitorContactRepository implements ContactRepository {
  public constructor(
    private readonly permissionService = new ContactPermissionService(),
    private readonly defaultContactAccountService = new DefaultContactAccountService(),
  ) {}

  public checkPermissions(): Promise<ContactPermissionState> {
    return this.permissionService.check();
  }

  public requestPermissions(): Promise<ContactPermissionState> {
    return this.permissionService.request();
  }

  public openSettings(): Promise<void> {
    return this.permissionService.openSettings();
  }

  public async getContacts(): Promise<ContactSummary[]> {
    try {
      const { total } = await Contacts.countContacts();

      const contacts: ContactSummary[] = [];

      for (let offset = 0; offset < total; offset += PAGE_SIZE) {
        const result = await Contacts.getContacts({
          fields: CONTACT_FIELDS,
          limit: PAGE_SIZE,
          offset,
        });

        const mapped = result.contacts
          .map(mapNativeContactSummary)
          .filter(
            (contact): contact is ContactSummary =>
              contact !== null,
          );

        contacts.push(...mapped);

        if (result.contacts.length === 0) {
          break;
        }
      }

      return contacts;
    } catch (error) {
      throw asAppError(
        error,
        'CONTACTS_LOAD_FAILED',
        'Die Kontakte konnten nicht geladen werden.',
      );
    }
  }

  public async getContactById(
    contactId: string,
  ): Promise<ContactDetail | null> {
    try {
      const { contact } = await Contacts.getContactById({
        id: contactId,
        fields: CONTACT_FIELDS,
      });

      return contact
        ? mapNativeContactDetail(contact)
        : null;
    } catch (error) {
      throw asAppError(
        error,
        'CONTACTS_LOAD_FAILED',
        'Der Kontakt konnte nicht geladen werden.',
      );
    }
  }

  public async createContact(
    input: CreateContactInput,
  ): Promise<string> {
    try {
      const defaultAccount =
        await this.defaultContactAccountService.getDefaultAccount();

      const contact: Omit<NativeContact, 'id'> = {
        ...(defaultAccount
          ? {
              account: defaultAccount,
            }
          : {}),
        givenName: input.givenName || undefined,
        familyName: input.familyName || undefined,
        birthday: birthdayFromInput(input.birthday),
        phoneNumbers: input.phoneNumber
          ? [
              {
                value: input.phoneNumber,
                type: PhoneNumberType.Mobile,
                isPrimary: true,
              },
            ]
          : undefined,
        emailAddresses: input.emailAddress
          ? [
              {
                value: input.emailAddress,
                type: EmailAddressType.Home,
                isPrimary: true,
              },
            ]
          : undefined,
      } as Omit<NativeContact, 'id'>;

      const { id } = await Contacts.createContact({
        contact,
      });

      if (!id) {
        throw new AppError(
          'CONTACT_CREATE_FAILED',
          'Der neue Kontakt besitzt keine gültige ID.',
        );
      }

      return id;
    } catch (error) {
      throw asAppError(
        error,
        'CONTACT_CREATE_FAILED',
        'Der Kontakt konnte nicht gespeichert werden.',
      );
    }
  }

  public async deleteContact(
    contactId: string,
  ): Promise<void> {
    try {
      await Contacts.deleteContactById({
        id: contactId,
      });
    } catch (error) {
      throw asAppError(
        error,
        'CONTACT_DELETE_FAILED',
        'Der Kontakt konnte nicht gelöscht werden.',
      );
    }
  }
}