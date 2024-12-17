package com.genuswfm;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class VersionNameModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public VersionNameModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "VersionNameModule";
    }

    @ReactMethod
    public void getVersionName(Promise promise) {
        try {
            String versionName = BuildConfig.VERSION_NAME;
            promise.resolve(versionName);
        } catch (Exception e) {
            promise.reject("VERSION_NAME_ERROR", e);
        }
    }

}
