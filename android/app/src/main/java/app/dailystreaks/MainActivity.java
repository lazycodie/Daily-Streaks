package app.dailystreaks;

import android.annotation.SuppressLint;
import android.content.res.Configuration;
import android.net.Uri;
import android.os.Bundle;
import android.util.Base64;
import android.widget.Toast;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import java.io.OutputStream;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

import androidx.activity.ComponentActivity;
import androidx.activity.EdgeToEdge;
import androidx.activity.OnBackPressedCallback;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.webkit.WebSettingsCompat;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewFeature;

import java.io.ByteArrayInputStream;

/**
 * Hosts the offline Daily Streaks web app in a locked-down WebView.
 * - Content is served only from the APK's own assets (WebViewAssetLoader).
 * - Every other request is answered locally with 403, so nothing leaves the phone.
 * - No JavaScript interface, no file/content access, no permissions granted to the page.
 */
public class MainActivity extends ComponentActivity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final String START_URL = "https://" + HOST + "/assets/www/index.html";
    private WebView web;
    private static final int MAX_EXPORT_BYTES = 10 * 1024 * 1024;
    private static final String XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    private byte[] pendingExport;
    // Android's own "Save to..." screen: the person picks where the file goes; the app needs no storage permission.
    private final ActivityResultLauncher<String> saveDoc = registerForActivityResult(
            new ActivityResultContracts.CreateDocument(XLSX), uri -> {
                byte[] data = pendingExport; pendingExport = null;
                if (uri == null || data == null) return;
                try (OutputStream out = getContentResolver().openOutputStream(uri)) {
                    if (out == null) throw new java.io.IOException("no stream");
                    out.write(data);
                    Toast.makeText(this, "Excel file saved", Toast.LENGTH_SHORT).show();
                } catch (Exception e) {
                    Toast.makeText(this, "Couldn't save the file", Toast.LENGTH_LONG).show();
                }
            });

    /** The page asks to export by navigating to /__export on its own virtual host. Only .xlsx data is accepted. */
    private void handleExport(Uri u) {
        String name = u.getQueryParameter("name");
        String data = u.getQueryParameter("data");
        if (data == null || data.length() > MAX_EXPORT_BYTES * 4 / 3 + 8) return;
        byte[] bytes;
        try { bytes = Base64.decode(data, Base64.URL_SAFE | Base64.NO_WRAP | Base64.NO_PADDING); }
        catch (IllegalArgumentException e) { return; }
        // an .xlsx file is a zip: it must start with "PK"
        if (bytes.length < 4 || bytes[0] != 'P' || bytes[1] != 'K') return;
        if (name == null || !name.matches("[A-Za-z0-9 ._-]{1,80}\\.xlsx")) name = "daily-streaks.xlsx";
        pendingExport = bytes;
        saveDoc.launch(name);
    }

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);

        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(getColor(R.color.bg));
        web = new WebView(this);
        web.setBackgroundColor(0xFF030C0B); // matches the splash, so app start is seamless
        root.addView(web, new FrameLayout.LayoutParams(-1, -1));
        setContentView(root);

        boolean night = (getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK) == Configuration.UI_MODE_NIGHT_YES;
        WindowCompat.getInsetsController(getWindow(), root).setAppearanceLightStatusBars(!night);
        WindowCompat.getInsetsController(getWindow(), root).setAppearanceLightNavigationBars(!night);
        ViewCompat.setOnApplyWindowInsetsListener(root, (v, insets) -> {
            Insets b = insets.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout() | WindowInsetsCompat.Type.ime());
            v.setPadding(b.left, b.top, b.right, b.bottom);
            return WindowInsetsCompat.CONSUMED;
        });

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);          // habits are kept in this app's private localStorage
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setGeolocationEnabled(false);
        s.setSupportMultipleWindows(false);
        s.setJavaScriptCanOpenWindowsAutomatically(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        s.setMediaPlaybackRequiresUserGesture(true);
        if (WebViewFeature.isFeatureSupported(WebViewFeature.SAFE_BROWSING_ENABLE)) {
            WebSettingsCompat.setSafeBrowsingEnabled(s, false); // avoid lookups to Google
        }

        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .setDomain(HOST)
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri u = request.getUrl();
                WebResourceResponse r = HOST.equals(u.getHost()) ? loader.shouldInterceptRequest(u) : null;
                if (r != null) return r;
                // Block anything else (remote hosts, unknown paths).
                return new WebResourceResponse("text/plain", "utf-8", 403, "Blocked", null, new ByteArrayInputStream(new byte[0]));
            }
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri u = request.getUrl();
                if (HOST.equals(u.getHost()) && "/__export".equals(u.getPath())) { handleExport(u); return true; }
                return !HOST.equals(u.getHost()); // never navigate away from the app
            }
            @Override
            public boolean onRenderProcessGone(WebView view, android.webkit.RenderProcessGoneDetail detail) {
                // The system reclaimed the page's renderer: rebuild the screen instead of crashing. Habits are already saved.
                if (view.getParent() instanceof android.view.ViewGroup) ((android.view.ViewGroup) view.getParent()).removeView(view);
                view.destroy();
                web = null;
                recreate();
                return true;
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(PermissionRequest request) { request.deny(); }
        });

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (web.canGoBack()) web.goBack();
                else { setEnabled(false); getOnBackPressedDispatcher().onBackPressed(); }
            }
        });

        if (savedInstanceState == null || web.restoreState(savedInstanceState) == null) web.loadUrl(START_URL);
    }

    @Override protected void onSaveInstanceState(Bundle out) { super.onSaveInstanceState(out); if (web != null) web.saveState(out); }
    @Override protected void onResume() { super.onResume(); if (web != null) web.onResume(); }
    @Override protected void onPause() { if (web != null) web.onPause(); super.onPause(); }
    @Override protected void onDestroy() { if (web != null) { web.destroy(); } super.onDestroy(); }
}
