import type { ContactBirthday } from '@/domain/models/ContactBirthday';

export const buildDisplayName = (givenName: string, familyName: string): string => {
  const displayName = `${givenName.trim()} ${familyName.trim()}`.trim();
  return displayName || 'Unbenannter Kontakt';
};

export const formatBirthday = (birthday: ContactBirthday | null): string => {
  if (!birthday) {
    return 'Nicht angegeben';
  }

  const day = String(birthday.day).padStart(2, '0');
  const month = String(birthday.month).padStart(2, '0');
  return birthday.year ? `${day}.${month}.${birthday.year}` : `${day}.${month}.`;
};

export const formatTypeLabel = (type: string | undefined, customLabel?: string): string | null => {
  if (customLabel?.trim()) {
    return customLabel.trim();
  }

  const labels: Record<string, string> = {
    MOBILE: 'Mobil',
    HOME: 'Privat',
    WORK: 'Arbeit',
    OTHER: 'Sonstige',
    CUSTOM: 'Benutzerdefiniert',
    MAIN: 'Hauptnummer',
    SCHOOL: 'Schule',
  };

  return type ? labels[type] ?? type : null;
};
