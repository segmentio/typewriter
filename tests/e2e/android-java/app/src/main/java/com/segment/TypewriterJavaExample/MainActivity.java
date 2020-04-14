package com.segment.TypewriterJavaExample;

import java.util.*;
import android.view.View;
import android.widget.EditText;
import android.content.Intent;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;

import com.segment.generated.*;
import com.segment.analytics.Analytics;

public class MainActivity extends AppCompatActivity {
  public static final String EXTRA_MESSAGE = "com.segment.PRODUCT_NAME";

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
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
    List defaultArray = Arrays.asList(137, "C-137");
    HashMap defaultObject = new HashMap<>();

    RequiredArrayWithPropertiesItem1 requiredArrayWithPropertiesItem = new RequiredArrayWithPropertiesItem1.Builder()
      .requiredAny("Rick Sanchez")
      .requiredArray(defaultArray)
      .requiredBoolean(false)
      .requiredInt(97L)
      .requiredNumber(3.14)
      .requiredObject(defaultObject)
      .requiredString("Alpha-Betrium")
      .requiredStringWithRegex("Lawyer Mort")
      .build();

    RequiredObjectWithProperties1 requiredObjectWithProperties = new RequiredObjectWithProperties1.Builder()
      .requiredAny("Rick Sanchez")
      .requiredArray(defaultArray)
      .requiredBoolean(false)
      .requiredInt(97L)
      .requiredNumber(3.14)
      .requiredObject(defaultObject)
      .requiredString("Alpha-Betrium")
      .requiredStringWithRegex("Lawyer Mort")
      .build();

    EveryRequiredType everyRequiredType = new EveryRequiredType.Builder()
      .requiredAny("Rick Sanchez")
      .requiredArray(defaultArray)
      .requiredArrayWithProperties(Arrays.asList(requiredArrayWithPropertiesItem))
      .requiredBoolean(false)
      .requiredInt(97L)
      .requiredNumber(3.14)
      .requiredObject(defaultObject)
      .requiredObjectWithProperties(requiredObjectWithProperties)
      .requiredString("Alpha-Betrium")
      .requiredStringWithRegex("Lawyer Morty")
      .build();
    
    TypewriterAnalytics.with(this).everyRequiredType(everyRequiredType);
  }
}
