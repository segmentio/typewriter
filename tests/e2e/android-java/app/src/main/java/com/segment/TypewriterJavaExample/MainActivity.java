package com.segment.TypewriterJavaExample;

import java.util.*;
import android.view.View;
import android.widget.EditText;
import android.content.Intent;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;

import com.segment.generated.SEGTypewriterAnalytics;
import com.segment.analytics.Analytics;

public class MainActivity extends AppCompatActivity {
  public static final String EXTRA_MESSAGE = "com.segment.PRODUCT_NAME";
  private SEGTypewriterAnalytics segAnalytics;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    this.segAnalytics = new SEGTypewriterAnalytics(Analytics.with(this));
  }

  public void sendMessageButtonSelected(View view) {
    Intent intent = new Intent(this, DisplayMessageActivity.class);
    EditText productNameEditText = findViewById(R.id.productNameEditText);
    String productName = productNameEditText.getText().toString();

    this.onOrderCompleted(productName);

    intent.putExtra(EXTRA_MESSAGE, productName);
    startActivity(intent);
  }

  private void onOrderCompleted(String productName) {
  }
}
