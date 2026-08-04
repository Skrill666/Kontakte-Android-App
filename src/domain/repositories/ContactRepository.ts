import type { ContactDetail } from '@/domain/models/ContactDetail';
import type { ContactPermissionState } from '@/domain/models/ContactPermissionState';
import type { ContactSummary } from '@/domain/models/ContactSummary';
import type { CreateContactInput } from '@/domain/models/CreateContactInput';

export interface ContactRepository {
  checkPermissions(): Promise<ContactPermissionState>;
  requestPermissions(): Promise<ContactPermissionState>;
  openSettings(): Promise<void>;
  getContacts(): Promise<ContactSummary[]>;
  getContactById(contactId: string): Promise<ContactDetail | null>;
  createContact(input: CreateContactInput): Promise<string>;
  deleteContact(contactId: string): Promise<void>;
}
