package com.luckeyfaraday.womenai;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import android.webkit.CookieManager;
import android.webkit.WebView;

public class MainActivity extends BridgeActivity {
    @Override
    public void onStart() {
        super.onStart();
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            android.webkit.CookieManager.getInstance().setAcceptThirdPartyCookies(this.getBridge().getWebView(), true);
        }
    }
}
