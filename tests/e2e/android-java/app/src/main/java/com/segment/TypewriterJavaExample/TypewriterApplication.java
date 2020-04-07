package com.segment.TypewriterJavaExample;

import java.util.*;
import com.segment.analytics.Analytics;

public class TypewriterApplication extends android.app.Application {
  @Override
  public void onCreate() {
    super.onCreate();

    // Analytics analytics = new Analytics.Builder(getApplicationContext(),
    // "yGatIsoMfwLE4mTp7xky916C45uMfWF0")
    // .trackApplicationLifecycleEvents().recordScreenViews().build();

    // Analytics.setSingletonInstance(analytics);
  }
}
