import type { ContactRepository } from '@/domain/repositories/ContactRepository';
import { CapacitorContactRepository } from './CapacitorContactRepository';

let repository: ContactRepository = new CapacitorContactRepository();

export const getContactRepository = (): ContactRepository => repository;

export const setContactRepositoryForTests = (replacement: ContactRepository): void => {
  repository = replacement;
};

export const resetContactRepository = (): void => {
  repository = new CapacitorContactRepository();
};
