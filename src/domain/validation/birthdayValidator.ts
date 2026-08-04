export const isValidBirthday = (value: string): boolean => {
  if (value.length === 0) {
    return true;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(value);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day &&
    parsed <= today
  );
};
