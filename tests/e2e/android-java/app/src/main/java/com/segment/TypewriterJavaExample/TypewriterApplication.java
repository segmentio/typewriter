package com.segment.TypewriterJavaExample;

import com.segment.analytics.Analytics;

public class TypewriterApplication extends android.app.Application {
  @Override
  public void onCreate() {
    super.onCreate();

    Analytics analytics = new Analytics.Builder(getApplicationContext(), "123456")
        .trackApplicationLifecycleEvents()
        .recordScreenViews()
        .build();

    Analytics.setSingletonInstance(analytics);
  }
}
