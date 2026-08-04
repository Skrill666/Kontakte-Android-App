export const isValidPhoneNumber = (value: string): boolean => {
  if (value.length === 0) {
    return true;
  }

  const digitCount = value.replace(/\D/gu, '').length;
  const containsOnlyAllowedCharacters = /^[+\d\s()\-/.]+$/u.test(value);
  return digitCount >= 3 && containsOnlyAllowedCharacters;
};
