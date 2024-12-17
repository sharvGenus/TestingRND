package com.genuswfm;

import android.annotation.SuppressLint;
import android.os.Build;
import android.content.Context;
import android.telephony.CellInfo;
import android.telephony.CellInfoGsm;
import android.telephony.CellInfoLte;
import android.telephony.CellInfoNr;
import android.telephony.CellInfoWcdma;
import android.telephony.CellSignalStrength;
import android.telephony.CellSignalStrengthGsm;
import android.telephony.CellSignalStrengthLte;
import android.telephony.CellSignalStrengthCdma;
import android.telephony.CellSignalStrengthNr;
import android.telephony.CellSignalStrengthWcdma;
import android.telephony.PhoneStateListener;
import android.telephony.SignalStrength;
import android.telephony.TelephonyManager;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.telephony.SubscriptionInfo;
import android.telephony.SubscriptionManager;

import java.util.List;

public class SignalStrengthModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private boolean isListening = false;
    private Callback signalCallback;
    private TelephonyManager telephonyManager;

    public SignalStrengthModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "SignalStrengthModule";
    }

    private PhoneStateListener createPhoneStateListener() {
        return new PhoneStateListener() {
            @SuppressLint("MissingPermission")
            @Override
            public void onSignalStrengthsChanged(SignalStrength signalStrength) {
                super.onSignalStrengthsChanged(signalStrength);

                List<SubscriptionInfo> activeSubscriptions = getActiveSubscriptions();
                int rsrp = -1;
                int rsrq = -1;
                int asu = -1;
                int sinr = -1;
                int simSlotIndex = -1;
                String networkType = "";
                String carrierName = "";
                int rsrp2 = -1;
                int rsrq2 = -1;
                int sinr2 = -1;
                int asu2 = -1;
                int simSlotIndex2 = -1;
                String networkTypeString2 = "";
                String carrierName2 = "";
                if (signalCallback != null && activeSubscriptions != null) {
                    int defaultSimSlotIndex = getDefaultSimSlotIndex();
                    boolean defaultSimFound = false;

                    for (SubscriptionInfo subscriptionInfo : activeSubscriptions) {
                         simSlotIndex = subscriptionInfo.getSimSlotIndex();
                         if(subscriptionInfo.getCarrierName() != null){
                             carrierName = subscriptionInfo.getCarrierName().toString();
                         }else{
                            carrierName = null;
                         }

                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                            // Retrieve signal strength details for both default and non-default SIMs
                            List<CellSignalStrength> cellSignalStrengths = signalStrength.getCellSignalStrengths();
                            if (cellSignalStrengths != null && !cellSignalStrengths.isEmpty()) {
                                CellSignalStrength cellSignalStrength = cellSignalStrengths.get(0);
                                if (cellSignalStrength instanceof CellSignalStrengthGsm) {
                                    rsrp = ((CellSignalStrengthGsm) cellSignalStrength).getDbm();
                                    asu = ((CellSignalStrengthGsm) cellSignalStrength).getAsuLevel();
                                } else if (cellSignalStrength instanceof CellSignalStrengthLte) {
                                    rsrp = ((CellSignalStrengthLte) cellSignalStrength).getRsrp();
                                    rsrq = ((CellSignalStrengthLte) cellSignalStrength).getRsrq();
                                    sinr = ((CellSignalStrengthLte) cellSignalStrength).getRssnr();
                                    asu = ((CellSignalStrengthLte) cellSignalStrength).getAsuLevel();
                                } else if (cellSignalStrength instanceof CellSignalStrengthCdma) {
                                    rsrp = ((CellSignalStrengthCdma) cellSignalStrength).getDbm();
                                    asu = ((CellSignalStrengthCdma) cellSignalStrength).getAsuLevel();
                                } else if (cellSignalStrength instanceof CellSignalStrengthNr) {
                                    rsrp = ((CellSignalStrengthNr) cellSignalStrength).getSsRsrp();
                                    rsrq = ((CellSignalStrengthNr) cellSignalStrength).getSsRsrq();
                                    sinr = ((CellSignalStrengthNr) cellSignalStrength).getSsSinr();
                                    asu = ((CellSignalStrengthNr) cellSignalStrength).getAsuLevel();
                                } else {
                                    rsrp = -1;
                                }
                            } else {
                                rsrp = -1;
                            }
                        } else {
                            rsrp = signalStrength.getGsmSignalStrength();
                        }

                        networkType = getNetworkTypeString(((TelephonyManager) reactContext.getSystemService(reactContext.TELEPHONY_SERVICE)).getNetworkType());

                        if (simSlotIndex == defaultSimSlotIndex && !isESIMCarrier(carrierName) && signalCallback != null) {
                            // Send full details for the default SIM
                            defaultSimFound = true;
                            break;
                        }
                    }

                    if (activeSubscriptions.size() > 1 && telephonyManager.getAllCellInfo().size() > 1) {
                        // Find a non-default SIM (e.g., the first one) and send its details
                        SubscriptionInfo nonDefaultSim = findNonDefaultSim(activeSubscriptions);
                        if (nonDefaultSim != null) {
                            rsrp2 = -1;
                            rsrq2 = -1;
                            sinr2 = -1;
                            asu2 = -1;
                            simSlotIndex2 = nonDefaultSim.getSimSlotIndex();
                            if(nonDefaultSim.getCarrierName() != null){
                                carrierName2 = nonDefaultSim.getCarrierName().toString();
                            }else{
                                carrierName2 = null;
                            }
                            // Add null check and index bounds check for cellInfo
                            List<CellInfo> allCellInfo = telephonyManager.getAllCellInfo();
                            if (allCellInfo != null && simSlotIndex2 >= 0 && simSlotIndex2 < allCellInfo.size()) {
                                CellInfo cellInfo = allCellInfo.get(simSlotIndex2);
                                if (cellInfo instanceof CellInfoGsm) {
                                    CellSignalStrengthGsm signalStrengthGsm = ((CellInfoGsm) cellInfo).getCellSignalStrength();
                                    rsrp2 = signalStrengthGsm.getDbm();
                                } else if (cellInfo instanceof CellInfoWcdma) {
                                    CellSignalStrengthWcdma signalStrengthWcdma = ((CellInfoWcdma) cellInfo).getCellSignalStrength();
                                    rsrp2 = signalStrengthWcdma.getDbm();
                                } else if (cellInfo instanceof CellInfoLte) {
                                    CellSignalStrengthLte signalStrengthLte = ((CellInfoLte) cellInfo).getCellSignalStrength();
                                    rsrp2 = signalStrengthLte.getRsrp();
                                    rsrq2 = signalStrengthLte.getRsrq();
                                    sinr2 = signalStrengthLte.getRssnr();
                                    asu2 = signalStrengthLte.getAsuLevel();
                                } else if (cellInfo instanceof CellInfoNr) {
                                    CellSignalStrengthNr signalStrengthNr = (CellSignalStrengthNr) ((CellInfoNr) cellInfo).getCellSignalStrength();
                                    rsrp2 = signalStrengthNr.getSsRsrp();
                                    rsrq2 = signalStrengthNr.getSsRsrq();
                                    sinr2 = signalStrengthNr.getSsSinr();
                                    asu2 = signalStrengthNr.getAsuLevel();
                                    // Update other signal strength values as needed
                                }
                                // Fetch network type for non-default SIM using TelephonyManager
                                int networkType2 = telephonyManager.getNetworkType();

                                networkTypeString2 = getNetworkTypeString(networkType2);
                            } else {
                                rsrp2 = -1;
                                rsrq2 = -1;
                                sinr2 = -1;
                                asu2 = -1;
                                carrierName2 = "";
                                networkTypeString2 = "";
                            }
                        }
                    }
                    if (signalCallback != null) {
                        signalCallback.invoke(rsrp, rsrq, sinr, asu, carrierName, networkType, simSlotIndex, rsrp2, rsrq2, sinr2, asu2, carrierName2, networkTypeString2, simSlotIndex2);
                        signalCallback = null;
                    }
                }
            }
        };
    }

    private SubscriptionInfo findNonDefaultSim(List<SubscriptionInfo> subscriptions) {
        int defaultSimSlotIndex = getDefaultSimSlotIndex();
        for (SubscriptionInfo subscriptionInfo : subscriptions) {
            if (subscriptionInfo.getSimSlotIndex() != defaultSimSlotIndex) {
                return subscriptionInfo;
            }
        }
        return null;
    }

    private int getDefaultSimSlotIndex() {
        SubscriptionManager subscriptionManager = SubscriptionManager.from(reactContext);
        int defaultSubId = SubscriptionManager.getDefaultSubscriptionId();
        List<SubscriptionInfo> activeSubscriptions = subscriptionManager.getActiveSubscriptionInfoList();

        if (activeSubscriptions != null) {
            for (SubscriptionInfo subscriptionInfo : activeSubscriptions) {
                if (subscriptionInfo.getSubscriptionId() == defaultSubId) {
                    return subscriptionInfo.getSimSlotIndex();
                }
            }
        }
        return -1; // Return a default value or handle the case when default SIM is not found
    }

    private boolean isESIMCarrier(String carrierName) {
        if (carrierName != null) {
            return carrierName.contains("eSIM");
        } else {
            return false;
        }
    }

    private List<SubscriptionInfo> getActiveSubscriptions() {
        SubscriptionManager subscriptionManager = SubscriptionManager.from(reactContext);
        return subscriptionManager.getActiveSubscriptionInfoList();
    }

    private String getNetworkTypeString(int networkType) {
        switch (networkType) {
            case TelephonyManager.NETWORK_TYPE_GPRS:
            case TelephonyManager.NETWORK_TYPE_EDGE:
            case TelephonyManager.NETWORK_TYPE_CDMA:
            case TelephonyManager.NETWORK_TYPE_1xRTT:
            case TelephonyManager.NETWORK_TYPE_IDEN:
                return "2G";
            case TelephonyManager.NETWORK_TYPE_UMTS:
            case TelephonyManager.NETWORK_TYPE_EVDO_0:
            case TelephonyManager.NETWORK_TYPE_EVDO_A:
            case TelephonyManager.NETWORK_TYPE_HSDPA:
            case TelephonyManager.NETWORK_TYPE_HSUPA:
            case TelephonyManager.NETWORK_TYPE_HSPA:
            case TelephonyManager.NETWORK_TYPE_EVDO_B:
            case TelephonyManager.NETWORK_TYPE_EHRPD:
            case TelephonyManager.NETWORK_TYPE_HSPAP:
                return "3G";
            case TelephonyManager.NETWORK_TYPE_LTE:
                return "4G";
            case TelephonyManager.NETWORK_TYPE_NR:
                return "5G";
            default:
                return "Unknown";
        }
    }

    @ReactMethod
    public void startListening(final Callback callback) {
        if (!isListening) {
            try {
                telephonyManager = (TelephonyManager) reactContext.getSystemService(reactContext.TELEPHONY_SERVICE);
                signalCallback = callback;
                telephonyManager.listen(createPhoneStateListener(), PhoneStateListener.LISTEN_SIGNAL_STRENGTHS);
                isListening = true;
            } catch (SecurityException e) {
                isListening = false;
                signalCallback = null;
            } catch (Exception e) {
                isListening = false;
                signalCallback = null;
            }
        }
    }

    @ReactMethod
    public void stopListening() {
        if (isListening) {
            telephonyManager = (TelephonyManager) reactContext.getSystemService(reactContext.TELEPHONY_SERVICE);
            telephonyManager.listen(createPhoneStateListener(), PhoneStateListener.LISTEN_NONE);
            isListening = false;
        }
    }
}