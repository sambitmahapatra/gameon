package com.gameon.offline;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Collections;

/** Offline assets only. No INTERNET permission, remote content or JavaScript bridge. */
public final class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final String HOME = "https://" + HOST + "/assets/index.html";
    private WebView web;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(11, 12, 16));
        if (Build.VERSION.SDK_INT >= 30) getWindow().setDecorFitsSystemWindows(false);
        root.setOnApplyWindowInsetsListener((view, insets) -> {
            if (Build.VERSION.SDK_INT >= 30) {
                android.graphics.Insets bars = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.ime());
                view.setPadding(bars.left, bars.top, bars.right, bars.bottom);
            } else {
                view.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(), insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            }
            return insets;
        });
        web = new WebView(this);
        web.setBackgroundColor(Color.rgb(11,12,16));
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setBlockNetworkLoads(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setSupportMultipleWindows(false);
        settings.setUserAgentString(settings.getUserAgentString() + " GameOnOffline/1.0");
        web.setWebChromeClient(new WebChromeClient());
        web.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri=request.getUrl();
                if ("https".equals(uri.getScheme()) && HOST.equals(uri.getHost()) && "/assets/index.html".equals(uri.getPath())) {
                    try { return new WebResourceResponse("text/html", "UTF-8", getAssets().open("index.html")); }
                    catch (IOException error) { return empty(500,"Asset unavailable"); }
                }
                return empty(403,"Offline app");
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                boolean localShare="gameon-share".equals(request.getUrl().getScheme()) && view.getUrl()!=null && view.getUrl().startsWith(HOME);
                return navigate(request.getUrl(), request.isForMainFrame() && (request.hasGesture() || localShare));
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return navigate(Uri.parse(url),true);
            }
        });
        root.addView(web,new FrameLayout.LayoutParams(-1,-1));
        setContentView(root);
        root.requestApplyInsets();
        web.loadUrl(HOME);
    }
    private WebResourceResponse empty(int code,String reason) {
        return new WebResourceResponse("text/plain","UTF-8",code,reason,Collections.emptyMap(),new ByteArrayInputStream(new byte[0]));
    }
    private boolean navigate(Uri uri, boolean userAction) {
        if ("https".equals(uri.getScheme()) && HOST.equals(uri.getHost()) && "/assets/index.html".equals(uri.getPath())) return false;
        if (!userAction) return true;
        try {
            if ("gameon-share".equals(uri.getScheme()) && "text".equals(uri.getHost())) {
                String text=uri.getQueryParameter("body");
                if(text!=null && text.length()<=12000) {
                    Intent share=new Intent(Intent.ACTION_SEND).setType("text/plain").putExtra(Intent.EXTRA_TEXT,text);
                    startActivity(Intent.createChooser(share,"Share your GameOn plan"));
                }
            } else if ("tel".equals(uri.getScheme()) && "+912249607890".equals(uri.getSchemeSpecificPart())) {
                startActivity(new Intent(Intent.ACTION_DIAL,uri));
            } else if ("https".equals(uri.getScheme()) && ("maps.google.com".equals(uri.getHost()) || "www.google.com".equals(uri.getHost()))) {
                startActivity(new Intent(Intent.ACTION_VIEW,uri));
            }
        } catch (ActivityNotFoundException error) { Toast.makeText(this,"No app is available for this action.",Toast.LENGTH_SHORT).show(); }
        return true;
    }
    @Override public void onBackPressed() {
        web.evaluateJavascript("window.gameonBack ? window.gameonBack() : false",result -> { if(!"true".equals(result))MainActivity.super.onBackPressed(); });
    }
    @Override protected void onDestroy() { if(web!=null){web.stopLoading();web.destroy();}super.onDestroy(); }
}
