package com.genuswfm;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.accessibilityservice.AccessibilityService;
import android.os.Handler;
import android.net.TrafficStats;
import android.os.Looper;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkCapabilities;
import android.util.Log;

public class NetworkSpeedModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private Callback signalCallback;
    private static final int INTERVAL = 1000; // 1 second interval
    private long lastRxBytes = 0;
    private Handler handler = new Handler(Looper.getMainLooper());
    private Runnable speedUpdateRunnable;
    private Context context;
    public NetworkSpeedModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.context = reactContext;
        setupRunnable();
    }

    @Override
    public String getName() {
        return "NetworkSpeedModule";
    }

    @ReactMethod
    public void startMonitoring(final Callback callback) {
        lastRxBytes = TrafficStats.getTotalRxBytes();
        signalCallback = callback;
        handler.postDelayed(speedUpdateRunnable, INTERVAL);
    }

    @ReactMethod
    public void stopMonitoring() {
        handler.removeCallbacks(speedUpdateRunnable);
    }

    private void updateSpeed() {
        long currentRxBytes = TrafficStats.getTotalRxBytes();
        long bytesSinceLastUpdate = currentRxBytes - lastRxBytes;
    
        double kilobytesPerSecond = bytesSinceLastUpdate / 1024.0 / (INTERVAL / 1000.0); // divide by 1024 to get KB, divide by interval in seconds
    
        ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkCapabilities nc = cm.getNetworkCapabilities(cm.getActiveNetwork());
        if (nc != null) {
            int downSpeed = nc.getLinkDownstreamBandwidthKbps();
            int upSpeed = nc.getLinkUpstreamBandwidthKbps();
            double downSpeedMBps = downSpeed * 0.000125;
            double upSpeedMBps = upSpeed * 0.000125;
    
            if (signalCallback != null) {
                signalCallback.invoke(downSpeedMBps, upSpeedMBps);
                signalCallback = null;
            }
        } else {
            // Send null values for both download and upload speeds
            if (signalCallback != null) {
                signalCallback.invoke(null, null);
                signalCallback = null;
            }
        }
    
        lastRxBytes = currentRxBytes;
        handler.postDelayed(speedUpdateRunnable, INTERVAL);
    }

    private void setupRunnable() {
        speedUpdateRunnable = new Runnable() {
            @Override
            public void run() {
                updateSpeed();
            }
        };
    }
}
