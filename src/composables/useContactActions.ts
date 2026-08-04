import { AppLauncherService } from '@/services/native/AppLauncherService';
import { ClipboardService } from '@/services/native/ClipboardService';
import { SmsComposerService } from '@/services/native/SmsComposerService';
import { asAppError } from '@/domain/errors/AppError';
import { useAppMessages } from './useAppMessages';

const appLauncher = new AppLauncherService();
const clipboard = new ClipboardService();
const smsComposer = new SmsComposerService();

export const useContactActions = () => {
  const messages = useAppMessages();

  const execute = async (action: () => Promise<void>, fallback: string): Promise<boolean> => {
    try {
      await action();
      return true;
    } catch (error) {
      const appError = asAppError(error, 'UNKNOWN_ERROR', fallback);
      await messages.showError(appError.message);
      return false;
    }
  };

  return {
    openPhone: (phone: string) => execute(() => appLauncher.openPhone(phone), 'Die Telefon-App konnte nicht geöffnet werden.'),
    openEmail: (email: string) => execute(() => appLauncher.openEmail(email), 'Die E-Mail-App konnte nicht geöffnet werden.'),
    composeSms: (phone: string) => execute(() => smsComposer.composeSms(phone), 'Die SMS-App konnte nicht geöffnet werden.'),
    copyPhone: async (phone: string) => {
      const copied = await execute(() => clipboard.copyText(phone, 'Telefonnummer'), 'Die Telefonnummer konnte nicht kopiert werden.');
      if (copied) await messages.showSuccess('Telefonnummer kopiert.');
    },
    copyEmail: async (email: string) => {
      const copied = await execute(() => clipboard.copyText(email, 'E-Mail-Adresse'), 'Die E-Mail-Adresse konnte nicht kopiert werden.');
      if (copied) await messages.showSuccess('E-Mail-Adresse kopiert.');
    },
  };
};
