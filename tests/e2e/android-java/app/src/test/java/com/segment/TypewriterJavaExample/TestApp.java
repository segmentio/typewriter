package com.segment.TypewriterJavaExample;

import com.segment.analytics.*;

import java.io.IOException;
import java.net.HttpURLConnection;
import android.content.Context;
import android.net.Uri;

import org.robolectric.Shadows;
import org.robolectric.shadows.ShadowApplication;
import androidx.test.core.app.ApplicationProvider;

public class TestApp extends android.app.Application {
  @Override
  public final void onCreate() {
    final String host = "http://localhost:8765";
    ShadowApplication shadowApp = Shadows.shadowOf(this);
    shadowApp.grantPermissions("android.permission.INTERNET");
    Context ctx = ApplicationProvider.getApplicationContext();
    Analytics analytics = new Analytics.Builder(ctx, "123456").connectionFactory(new ConnectionFactory() {
      @Override
      protected HttpURLConnection openConnection(String url) throws IOException {
        String path = Uri.parse(url).getPath();
        return super.openConnection(host + path);
      }
    }).trackApplicationLifecycleEvents().build();
    Analytics.setSingletonInstance(analytics);
  }
}