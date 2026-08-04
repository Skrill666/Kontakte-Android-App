import { AppLauncher } from '@capacitor/app-launcher';
import { AppError, asAppError } from '@/domain/errors/AppError';
import { createEmailUri, createTelephoneUri } from '@/utils/uriEncoding';

export class AppLauncherService {
  public async openPhone(phoneNumber: string): Promise<void> {
    await this.openUri(
      createTelephoneUri(phoneNumber),
      'PHONE_APP_UNAVAILABLE',
      'Auf diesem Gerät ist keine Telefon-App verfügbar.',
    );
  }

  public async openEmail(emailAddress: string): Promise<void> {
    await this.openUri(
      createEmailUri(emailAddress),
      'EMAIL_APP_UNAVAILABLE',
      'Auf diesem Gerät ist keine E-Mail-App verfügbar.',
    );
  }

  private async openUri(
    url: string,
    code: 'PHONE_APP_UNAVAILABLE' | 'EMAIL_APP_UNAVAILABLE',
    message: string,
  ): Promise<void> {
    try {
      const { value: canOpen } = await AppLauncher.canOpenUrl({ url });
      if (!canOpen) {
        throw new AppError(code, message);
      }
      const { completed } = await AppLauncher.openUrl({ url });
      if (!completed) {
        throw new AppError(code, message);
      }
    } catch (error) {
      throw asAppError(error, code, message);
    }
  }
}
