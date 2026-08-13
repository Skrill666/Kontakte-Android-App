package de.dhbw.kontakteapp;

import android.accounts.Account;
import android.os.Build;
import android.provider.ContactsContract;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "DefaultContactAccount")
public class DefaultContactAccountPlugin extends Plugin {

    private static final int API_LEVEL_DEFAULT_CONTACT_ACCOUNT = 36;

    @PluginMethod
    public void getDefaultAccount(PluginCall call) {

        if (Build.VERSION.SDK_INT < API_LEVEL_DEFAULT_CONTACT_ACCOUNT) {

            JSObject result = new JSObject();

            result.put(
                    "supported",
                    false
            );

            result.put(
                    "state",
                    "unsupported"
            );

            result.put(
                    "account",
                    null
            );

            call.resolve(result);

            return;
        }

        try {

            resolveDefaultAccountApi36(call);

        } catch (Exception exception) {

            call.reject(
                    "Das Android-Standardkonto für neue Kontakte konnte nicht ermittelt werden.",
                    exception
            );
        }
    }

    @android.annotation.TargetApi(API_LEVEL_DEFAULT_CONTACT_ACCOUNT)
    private void resolveDefaultAccountApi36(
            PluginCall call
    ) {

        ContactsContract.RawContacts.DefaultAccount.DefaultAccountAndState
                defaultAccountAndState =
                ContactsContract.RawContacts.DefaultAccount
                        .getDefaultAccountForNewContacts(
                                getContext()
                                        .getContentResolver()
                        );

        int state =
                defaultAccountAndState.getState();

        String stateName =
                "not-set";

        Account account =
                null;

        if (
                state ==
                        ContactsContract.RawContacts.DefaultAccount
                                .DefaultAccountAndState
                                .DEFAULT_ACCOUNT_STATE_CLOUD
        ) {

            stateName =
                    "cloud";

            account =
                    defaultAccountAndState
                            .getAccount();

        } else if (
                state ==
                        ContactsContract.RawContacts.DefaultAccount
                                .DefaultAccountAndState
                                .DEFAULT_ACCOUNT_STATE_SIM
        ) {

            stateName =
                    "sim";

            account =
                    defaultAccountAndState
                            .getAccount();

        } else if (
                state ==
                        ContactsContract.RawContacts.DefaultAccount
                                .DefaultAccountAndState
                                .DEFAULT_ACCOUNT_STATE_LOCAL
        ) {

            stateName =
                    "local";

            String localAccountName =
                    ContactsContract.RawContacts
                            .getLocalAccountName(
                                    getContext()
                            );

            String localAccountType =
                    ContactsContract.RawContacts
                            .getLocalAccountType(
                                    getContext()
                            );

            if (
                    localAccountName != null &&
                            localAccountType != null
            ) {

                account =
                        new Account(
                                localAccountName,
                                localAccountType
                        );
            }
        }

        JSObject result =
                new JSObject();

        result.put(
                "supported",
                true
        );

        result.put(
                "state",
                stateName
        );

        if (account == null) {

            result.put(
                    "account",
                    null
            );

        } else {

            JSObject accountResult =
                    new JSObject();

            accountResult.put(
                    "name",
                    account.name
            );

            accountResult.put(
                    "type",
                    account.type
            );

            result.put(
                    "account",
                    accountResult
            );
        }

        call.resolve(result);
    }
}