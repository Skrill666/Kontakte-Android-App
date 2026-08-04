import { Contacts, type PermissionStatus } from '@capawesome-team/capacitor-contacts';
import type { ContactPermissionState } from '@/domain/models/ContactPermissionState';

const mapPermissionStatus = (status: PermissionStatus): ContactPermissionState => ({
  readContacts: status.readContacts,
  writeContacts: status.writeContacts,
});

export class ContactPermissionService {
  public async check(): Promise<ContactPermissionState> {
    return mapPermissionStatus(await Contacts.checkPermissions());
  }

  public async request(): Promise<ContactPermissionState> {
    return mapPermissionStatus(
      await Contacts.requestPermissions({
        permissions: ['readContacts', 'writeContacts'],
      }),
    );
  }

  public async openSettings(): Promise<void> {
    await Contacts.openSettings();
  }
}
