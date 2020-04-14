package com.segment.TypewriterJavaExample;

import android.util.Log;
import com.segment.analytics.*;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import android.content.Context;
import android.net.Uri;

import com.segment.analytics.internal.Utils;
import org.robolectric.Shadows;
import org.robolectric.shadows.ShadowApplication;
import androidx.test.core.app.ApplicationProvider;

public class TestApp extends android.app.Application {
  @Override
  public final void onCreate() {
    ShadowApplication shadowApp = Shadows.shadowOf(this);
    shadowApp.grantPermissions("android.permission.INTERNET");
  }
}
