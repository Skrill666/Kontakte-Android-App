package de.dhbw.kontakteapp;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(
            Bundle savedInstanceState
    ) {

        registerPlugin(
                DefaultContactAccountPlugin.class
        );

        super.onCreate(
                savedInstanceState
        );
    }
}