import { SmsComposer } from '@capawesome/capacitor-sms-composer';
import { AppError, asAppError } from '@/domain/errors/AppError';

export class SmsComposerService {
  public async composeSms(phoneNumber: string): Promise<void> {
    try {
      const { canCompose } = await SmsComposer.canComposeSms();
      if (!canCompose) {
        throw new AppError(
          'SMS_APP_UNAVAILABLE',
          'Auf diesem Gerät ist keine SMS-App verfügbar.',
        );
      }
      await SmsComposer.composeSms({ recipients: [phoneNumber], body: '' });
    } catch (error) {
      throw asAppError(
        error,
        'SMS_APP_UNAVAILABLE',
        'Die SMS-App konnte nicht geöffnet werden.',
      );
    }
  }
}
