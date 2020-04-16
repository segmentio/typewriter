package com.segment.TypewriterJavaExample;

import java.util.*;
import com.segment.analytics.Analytics;

public class TypewriterApplication extends android.app.Application {
  @Override
  public void onCreate() {
    super.onCreate();

    Analytics analytics = new Analytics.Builder(this, "123456")
            .trackApplicationLifecycleEvents()
            .recordScreenViews()
            .build();

    // Set the initialized instance as a globally accessible instance.
    Analytics.setSingletonInstance(analytics);
  }
}
