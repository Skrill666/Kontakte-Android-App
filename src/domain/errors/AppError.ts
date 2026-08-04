export type AppErrorCode =
  | 'PERMISSION_DENIED'
  | 'CONTACT_NOT_FOUND'
  | 'CONTACTS_LOAD_FAILED'
  | 'CONTACT_CREATE_FAILED'
  | 'CONTACT_DELETE_FAILED'
  | 'CLIPBOARD_FAILED'
  | 'PHONE_APP_UNAVAILABLE'
  | 'EMAIL_APP_UNAVAILABLE'
  | 'SMS_APP_UNAVAILABLE'
  | 'INVALID_CONTACT'
  | 'UNKNOWN_ERROR';

export class AppError extends Error {
  public readonly code: AppErrorCode;
  public override readonly cause?: unknown;

  public constructor(code: AppErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.cause = cause;
  }
}

export const asAppError = (
  error: unknown,
  fallbackCode: AppErrorCode,
  fallbackMessage: string,
): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  return new AppError(fallbackCode, fallbackMessage, error);
};
