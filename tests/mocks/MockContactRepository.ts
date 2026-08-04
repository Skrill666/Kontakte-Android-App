import type { ContactDetail } from '@/domain/models/ContactDetail';
import type { ContactPermissionState } from '@/domain/models/ContactPermissionState';
import type { ContactSummary } from '@/domain/models/ContactSummary';
import type { CreateContactInput } from '@/domain/models/CreateContactInput';
import type { ContactRepository } from '@/domain/repositories/ContactRepository';
export class MockContactRepository implements ContactRepository {
  public permissions: ContactPermissionState = { readContacts: 'granted', writeContacts: 'granted' };
  public contacts: ContactSummary[] = [];
  public details = new Map<string, ContactDetail>();
  public checkPermissions = async () => this.permissions;
  public requestPermissions = async () => this.permissions;
  public openSettings = async () => undefined;
  public getContacts = async () => this.contacts;
  public getContactById = async (id: string) => this.details.get(id) ?? null;
  public createContact = async (_input: CreateContactInput) => 'new-id';
  public deleteContact = async (id: string) => { this.contacts = this.contacts.filter((contact) => contact.id !== id); };
}
