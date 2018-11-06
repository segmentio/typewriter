package com.segment.typewriterexample;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

import com.segment.analytics.Analytics;
import com.segment.analytics.KicksAppAnalytics;
import com.segment.analytics.OrderCompleted;
import com.segment.analytics.Product;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class MainActivity extends AppCompatActivity {
    public static final String EXTRA_MESSAGE = "com.segment.PRODUCT_NAME";
    private static final String SEGMENT_WRITE_KEY = "51GMfJ49iiQQPmzj227krjW9ch9gKpMx";
    private KicksAppAnalytics kicksAppAnalytics;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Analytics analytics = new Analytics.Builder(this, SEGMENT_WRITE_KEY)
                .trackApplicationLifecycleEvents()
                .recordScreenViews()
                .build();
        this.kicksAppAnalytics = new KicksAppAnalytics(analytics);
    }

    /** Called when the user taps the Send button */
    public void sendMessage(View view) {
        Intent intent = new Intent(this, DisplayMessageActivity.class);
        EditText editText = (EditText) findViewById(R.id.editText);
        String productName = editText.getText().toString();

        onOrderCompleted(productName);

        intent.putExtra(EXTRA_MESSAGE, productName);
        startActivity(intent);
    }

    private void onOrderCompleted(String productName) {
//        Double productCost = 9.99;
//        Product product = new Product.Builder()
//                .brand("Kicks App")
//                .name(productName)
//                .price(productCost)
//                .build();
//        List<Product> products = new ArrayList<>();
//        products.add(product);
//
//        OrderCompleted order = new OrderCompleted.Builder()
//                .currency("USD")
//                .orderID(UUID.randomUUID().toString())
//                .total(productCost)
//                .products(products)
//                .build();
//
//        this.kicksAppAnalytics.orderCompleted(order);
    }
}
