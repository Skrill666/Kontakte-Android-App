export type ContactPermissionValue =
  | 'prompt'
  | 'prompt-with-rationale'
  | 'granted'
  | 'denied'
  | 'limited';

export interface ContactPermissionState {
  readContacts: ContactPermissionValue;
  writeContacts: ContactPermissionValue;
}

export const hasReadContactAccess = (state: ContactPermissionState): boolean =>
  state.readContacts === 'granted' || state.readContacts === 'limited';

export const hasWriteContactAccess = (state: ContactPermissionState): boolean =>
  state.writeContacts === 'granted';

export const hasFullContactAccess = (state: ContactPermissionState): boolean =>
  hasReadContactAccess(state) && hasWriteContactAccess(state);

export const initialContactPermissionState = (): ContactPermissionState => ({
  readContacts: 'prompt',
  writeContacts: 'prompt',
});
