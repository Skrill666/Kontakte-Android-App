import { Capacitor, registerPlugin } from '@capacitor/core';
import type { Account } from '@capawesome-team/capacitor-contacts';

export type DefaultContactAccountState =
  | 'unsupported'
  | 'not-set'
  | 'local'
  | 'cloud'
  | 'sim';

interface DefaultContactAccountResult {
  supported: boolean;
  state: DefaultContactAccountState;
  account: Account | null;
}

interface DefaultContactAccountPlugin {
  getDefaultAccount(): Promise<DefaultContactAccountResult>;
}

const DefaultContactAccount = registerPlugin<DefaultContactAccountPlugin>(
  'DefaultContactAccount',
);

export class DefaultContactAccountService {
  public async getDefaultAccount(): Promise<Account | undefined> {
    if (Capacitor.getPlatform() !== 'android') {
      return undefined;
    }

    const result = await DefaultContactAccount.getDefaultAccount();
    return result.account ?? undefined;
  }
}