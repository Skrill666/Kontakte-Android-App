export const createTelephoneUri = (phoneNumber: string): string =>
  `tel:${encodeURI(phoneNumber.trim())}`;

export const createEmailUri = (emailAddress: string): string =>
  `mailto:${encodeURI(emailAddress.trim())}`;
