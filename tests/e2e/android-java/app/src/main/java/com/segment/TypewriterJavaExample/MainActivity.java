package com.segment.TypewriterJavaExample;

import android.view.View;
import android.widget.EditText;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import com.segment.analytics.Analytics;

public class MainActivity extends AppCompatActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
  }

  public void sendMessageButtonSelected(View view) {
    EditText productNameEditText = findViewById(R.id.productNameEditText);
    String productName = productNameEditText.getText().toString();
  }
}
