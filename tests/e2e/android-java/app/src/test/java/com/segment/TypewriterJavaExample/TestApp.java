package com.segment.TypewriterJavaExample;

import android.content.Context;

import com.segment.analytics.Analytics;


import org.robolectric.Shadows;
import org.robolectric.shadows.ShadowApplication;
import androidx.test.core.app.ApplicationProvider;

public class TestApp extends android.app.Application {
  @Override
  public final void onCreate() {
    ShadowApplication shadowApp = Shadows.shadowOf(this);
    shadowApp.grantPermissions("android.permission.INTERNET");
    Analytics analytics = Analytics.Builder(shadowApp.getApplicationContext(), "1234").build();
    Analytics.setSingletonInstance(analytics);
  }
}