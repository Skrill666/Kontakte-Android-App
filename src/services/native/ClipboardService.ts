import { Clipboard } from '@capacitor/clipboard';
import { asAppError } from '@/domain/errors/AppError';

export class ClipboardService {
  public async copyText(value: string, label: string): Promise<void> {
    try {
      await Clipboard.write({ string: value, label });
    } catch (error) {
      throw asAppError(error, 'CLIPBOARD_FAILED', 'Der Wert konnte nicht kopiert werden.');
    }
  }
}
