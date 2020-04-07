package com.segment.TypewriterJavaExample;

import android.content.Context;
import android.content.res.Configuration;

import com.segment.analytics.Analytics;


import org.robolectric.Shadows;
import org.robolectric.shadows.ShadowApplication;
import androidx.test.core.app.ApplicationProvider;


public class TestApp extends android.app.Application {
  @Override
  public final void onCreate() {
    ShadowApplication shadowApp = Shadows.shadowOf(this);
    shadowApp.grantPermissions("android.permission.INTERNET");
    Context ctx = ApplicationProvider.getApplicationContext();
    Analytics analytics = new Analytics.Builder(ctx, "1234")
            .trackApplicationLifecycleEvents()
            .recordScreenViews()
            .build();
    Analytics.setSingletonInstance(analytics);
  }
}