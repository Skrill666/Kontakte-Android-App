const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u;

export const isValidEmail = (value: string): boolean =>
  value.length === 0 || EMAIL_PATTERN.test(value);
