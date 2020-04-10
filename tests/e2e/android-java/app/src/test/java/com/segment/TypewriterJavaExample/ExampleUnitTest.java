package com.segment.TypewriterJavaExample;

import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.HandlerThread;
import com.segment.analytics.ConnectionFactory;
import com.segment.analytics.internal.Utils;
import com.segment.generated.*;
import com.segment.analytics.Analytics;
import com.segment.analytics.Properties;

import android.content.Context;
import android.os.Looper;

import java.io.IOException;
import java.lang.reflect.Field;
import java.net.HttpURLConnection;
import java.util.*;
import java.util.concurrent.*;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.Shadows;
import org.robolectric.annotation.Config;
import androidx.test.core.app.ApplicationProvider;
import org.robolectric.shadows.ShadowLooper;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = Build.VERSION_CODES.O_MR1, application = TestApp.class)
public class ExampleUnitTest {
  final String REMOTE_HOST = "http://localhost:8765";
  Utils.AnalyticsNetworkExecutorService networkExecutorService;

  Analytics analytics;

  @Before
  public void setUp() {
    networkExecutorService = new Utils.AnalyticsNetworkExecutorService();

    Context ctx = ApplicationProvider.getApplicationContext();
    analytics = new Analytics.Builder(ctx, "123456").networkExecutor(networkExecutorService)
        .connectionFactory(new ConnectionFactory() {
          @Override
          protected HttpURLConnection openConnection(String url) throws IOException {
            String path = Uri.parse(url).getPath();
            return super.openConnection(REMOTE_HOST + path);
          }
        }).build();

    Analytics.setSingletonInstance(analytics);
  }

  @Test
  public void exampleTests() {
    Context ctx = ApplicationProvider.getApplicationContext();
    SEGTypewriterAnalytics segAnalytics = new SEGTypewriterAnalytics(analytics);

    List defaultArray = Arrays.asList(137, "C-137");

    Object defaultObject = new Properties();

    segAnalytics.emptyEvent();

    RequiredArrayWithPropertiesItem1 requiredArrayWithPropertiesItem = new RequiredArrayWithPropertiesItem1.Builder()
      .requiredAny("Rick Sanchez")
      .requiredArray(defaultArray)
      .requiredBoolean(false)
      .requiredInt(97L)
      .requiredNumber(3.14)
      .requiredObject(defaultObject)
      .requiredString("Alpha-Betrium")
      .requiredStringWithRegex("Lawyer Morty")
      .build();

    RequiredObjectWithProperties1 requiredObjectWithProperties = new RequiredObjectWithProperties1.Builder()
      .requiredAny("Rick Sanchez")
      .requiredArray(defaultArray)
      .requiredBoolean(false)
      .requiredInt(97L)
      .requiredNumber(3.14)
      .requiredObject(defaultObject)
      .requiredString("Alpha-Betrium")
      .requiredStringWithRegex("Lawyer Morty")
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

    segAnalytics.everyRequiredType(everyRequiredType);

    OptionalArrayWithPropertiesItem1 optionalArrayWithProperties = new OptionalArrayWithPropertiesItem1.Builder()
      .optionalAny("Rick Sanchez")
      .optionalArray(defaultArray)
      .optionalBoolean(false)
      .optionalInt(97L)
      .optionalNumber(3.14)
      .optionalObject(defaultObject)
      .optionalString("Alpha-Betrium")
      .optionalStringWithRegex("Lawyer Morty")
      .build();

    OptionalObjectWithProperties1 optionalObjectWithProperties = new OptionalObjectWithProperties1.Builder()
      .optionalAny("Rick Sanchez")
      .optionalArray(defaultArray)
      .optionalBoolean(false)
      .optionalInt(97L)
      .optionalNumber(3.14)
      .optionalObject(defaultObject)
      .optionalString("Alpha-Betrium")
      .optionalStringWithRegex("Lawyer Morty")
      .build();

    EveryOptionalType everyOptionalType = new EveryOptionalType.Builder()
      .optionalAny("Rick Sanchez")
      .optionalArray(defaultArray)
      .optionalArrayWithProperties(Arrays.asList(optionalArrayWithProperties))
      .optionalBoolean(false)
      .optionalInt(97L)
      .optionalNumber(3.14)
      .optionalObject(defaultObject)
      .optionalObjectWithProperties(optionalObjectWithProperties)
      .optionalString("Alpha-Betrium")
      .optionalStringWithRegex("Lawyer Morty")
      .build();

    // no properties
    segAnalytics.everyOptionalType(new EveryOptionalType.Builder().build());
    // all properties
    segAnalytics.everyOptionalType(everyOptionalType);

    RequiredArrayWithPropertiesItem nullableRequiredArrayWithPropertiesItem = new RequiredArrayWithPropertiesItem.Builder()
      .requiredAny("Rick Sanchez")
      .requiredArray(defaultArray)
      .requiredBoolean(false)
      .requiredInt(97L)
      .requiredNumber(3.14)
      .requiredObject(defaultObject)
      .requiredString("Alpha-Betrium")
      .requiredStringWithRegex("Lawyer Morty")
      .build();

    RequiredObjectWithProperties nullableRequiredObjectWithProperties = new RequiredObjectWithProperties.Builder()
      .requiredAny("Rick Sanchez")
      .requiredArray(defaultArray)
      .requiredBoolean(false)
      .requiredInt(97L)
      .requiredNumber(3.14)
      .requiredObject(defaultObject)
      .requiredString("Alpha-Betrium")
      .requiredStringWithRegex("Lawyer Morty")
      .build();

    EveryNullableRequiredType everyNullableRequiredType = new EveryNullableRequiredType.Builder()
      .requiredAny("Rick Sanchez")
      .requiredArray(defaultArray)
      .requiredArrayWithProperties(Arrays.asList(nullableRequiredArrayWithPropertiesItem))
      .requiredBoolean(false)
      .requiredInt(97L)
      .requiredNumber(3.14)
      .requiredObject(defaultObject)
      .requiredObjectWithProperties(nullableRequiredObjectWithProperties)
      .requiredString("Alpha-Betrium")
      .requiredStringWithRegex("Lawyer Morty")
      .build();

    // complete
    segAnalytics.everyNullableRequiredType(everyNullableRequiredType);

    EveryNullableRequiredType everyNullableRequiredTypeNull = new EveryNullableRequiredType.Builder()
      .requiredAny(null)
      .requiredArray(null)
      .requiredArrayWithProperties(Arrays.asList(
        new RequiredArrayWithPropertiesItem.Builder()
          .requiredAny(null)
          .requiredArray(null)
          .requiredBoolean(null)
          .requiredInt(null)
          .requiredNumber(null)
          .requiredObject(null)
          .requiredString(null)
          .requiredStringWithRegex(null)
          .build()
        )
      )
      .requiredBoolean(null)
      .requiredInt(null)
      .requiredNumber(null)
      .requiredObject(null)
      .requiredObjectWithProperties(
        new RequiredObjectWithProperties.Builder()
          .requiredAny(null)
          .requiredArray(null)
          .requiredBoolean(null)
          .requiredInt(null)
          .requiredNumber(null)
          .requiredObject(null)
          .requiredString(null)
          .requiredStringWithRegex(null)
          .build()
      )
      .requiredString(null)
      .requiredStringWithRegex(null)
      .build();

    // all null
    segAnalytics.everyNullableRequiredType(everyNullableRequiredTypeNull);

    // no properties
    segAnalytics.everyNullableOptionalType(new EveryNullableOptionalType.Builder().build());

    OptionalObjectWithProperties optionalObjectWithPropertiesNull = new OptionalObjectWithProperties.Builder()
      .optionalAny(null).optionalArray(null).optionalBoolean(null).optionalInt(null).optionalNumber(null)
      .optionalObject(null).optionalString(null).optionalStringWithRegex(null).build();

    EveryNullableOptionalType everyNullableOptionalType = new EveryNullableOptionalType.Builder()
      .optionalAny(null)
      .optionalArray(null)
      .optionalArrayWithProperties(Arrays.asList(
        new OptionalArrayWithPropertiesItem.Builder()
          .optionalAny(null)
          .optionalArray(null)
          .optionalBoolean(null)
          .optionalInt(null)
          .optionalNumber(null)
          .optionalObject(null)
          .optionalString(null)
          .optionalStringWithRegex(null)
          .build()
      ))
      .optionalBoolean(null)
      .optionalInt(null)
      .optionalNumber(null)
      .optionalObject(null)
      .optionalObjectWithProperties(
        new OptionalObjectWithProperties.Builder()
          .optionalAny(null)
          .optionalArray(null)
          .optionalBoolean(null)
          .optionalInt(null)
          .optionalNumber(null)
          .optionalObject(null)
          .optionalString(null)
          .optionalStringWithRegex(null)
          .build()
      )
      .optionalString(null)
      .optionalStringWithRegex(null)
      .build();

    // all null
    segAnalytics.everyNullableOptionalType(everyNullableOptionalType);

    OptionalArrayWithPropertiesItem nullableOptionalArrayWithProperties = new OptionalArrayWithPropertiesItem.Builder()
      .optionalAny("Rick Sanchez")
      .optionalArray(defaultArray)
      .optionalBoolean(false)
      .optionalInt(97L)
      .optionalNumber(3.14)
      .optionalObject(defaultObject)
      .optionalString("Alpha-Betrium")
      .optionalStringWithRegex("Lawyer Morty")
      .build();

    OptionalObjectWithProperties nullableOptionalObjectWithProperties = new OptionalObjectWithProperties.Builder()
      .optionalAny("Rick Sanchez")
      .optionalArray(defaultArray)
      .optionalBoolean(false)
      .optionalInt(97L)
      .optionalNumber(3.14)
      .optionalObject(defaultObject)
      .optionalString("Alpha-Betrium")
      .optionalStringWithRegex("Lawyer Morty")
      .build();

    EveryNullableOptionalType everyNullableOptionalTypeComplete = new EveryNullableOptionalType.Builder()
      .optionalAny("Rick Sanchez")
      .optionalArray(defaultArray)
      .optionalArrayWithProperties(Arrays.asList(nullableOptionalArrayWithProperties))
      .optionalBoolean(false)
      .optionalInt(97L)
      .optionalNumber(3.14)
      .optionalObject(defaultObject)
      .optionalObjectWithProperties(nullableOptionalObjectWithProperties)
      .optionalString("Alpha-Betrium")
      .optionalStringWithRegex("Lawyer Morty")
      .build();

    // all complete
    segAnalytics.everyNullableOptionalType(everyNullableOptionalTypeComplete);

    segAnalytics.I42TerribleEventName3();

    PropertySanitized propertySanitized = new PropertySanitized.Builder()
      .I0000TerriblePropertyName3("what a cronenberg")
      .build();

    segAnalytics.propertySanitized(propertySanitized);

    segAnalytics.eventCollided();
    segAnalytics.eventCollided1();

    PropertiesCollided propertiesCollided = new PropertiesCollided.Builder()
      .propertyCollided("The Citadel")
      .propertyCollided1("Galactic Prison")
      .build();

    segAnalytics.propertiesCollided(propertiesCollided);

    OccupantsItem beth = new OccupantsItem.Builder()
      .name("Beth Smith")
      .build();

    OccupantsItem thomas = new OccupantsItem.Builder()
      .name("Thomas Lipkip")
      .build();

    Universe universe = new Universe.Builder()
      .name("Froopyland")
      .occupants(Arrays.asList(beth, thomas))
      .build();

    PropertyObjectNameCollision1 propertyObjectNameCollision1 = new PropertyObjectNameCollision1.Builder()
      .universe(universe)
      .build();

    segAnalytics.propertyObjectNameCollision1(propertyObjectNameCollision1);

    OccupantsItem1 beth1 = new OccupantsItem1.Builder()
      .name("Beth Smith")
      .build();

    OccupantsItem1 thomas1 = new OccupantsItem1.Builder()
      .name("Thomas Lipkip")
      .build();

    Universe1 universe2 = new Universe1.Builder()
      .name("Froopyland")
      .occupants(Arrays.asList(beth1, thomas1))
      .build();

    PropertyObjectNameCollision2 propertyObjectNameCollision2 = new PropertyObjectNameCollision2.Builder()
      .universe(universe2)
      .build();

    segAnalytics.propertyObjectNameCollision2(propertyObjectNameCollision2);

    ObjectItem objectItem = new ObjectItem.Builder().name("Beth Smith").build();

    SimpleArrayTypes simpleArrayTypes = new SimpleArrayTypes.Builder()
      .any(defaultArray)
      .boolean_(Arrays.asList(true, false))
      .integer(Arrays.asList(97L))
      .number(Arrays.asList(3.14))
      .object(Arrays.asList(objectItem))
      .string(Arrays.asList("Alpha-Betrium"))
      .build();

    segAnalytics.simpleArrayTypes(simpleArrayTypes);

    NestedObjects nestedObjectsWithGarage = new NestedObjects.Builder()
      .garage(
        new Garage.Builder()
          .tunnel(
            new Tunnel.Builder()
              .subterraneanLab(
                new SubterraneanLab.Builder()
                  .jerrysMemories(new ArrayList())
                  .mortysMemories(new ArrayList())
                  .summersContingencyPlan("Oh, man, it’s a scenario four.")
                  .build()
              )
              .build()
            )
            .build()
      ).build();

    segAnalytics.nestedObjects(nestedObjectsWithGarage);

    UniverseCharactersItemItem morty = new UniverseCharactersItemItem.Builder()
      .name("Morty Smith")
      .build();

    UniverseCharactersItemItem rick = new UniverseCharactersItemItem.Builder()
      .name("Rick Sanchez")
      .build();

    UniverseCharactersItemItem mortyCron = new UniverseCharactersItemItem.Builder()
      .name("Cronenberg Morty")
      .build();

    UniverseCharactersItemItem rickCron = new UniverseCharactersItemItem.Builder()
      .name("Cronenberg Rick")
      .build();

    List<List<UniverseCharactersItemItem>> universeCharacters = Arrays.asList(
      Arrays.asList(morty, rick),
      Arrays.asList(mortyCron, rickCron)
    );

    NestedArrays nestedArrays = new NestedArrays.Builder()
      .universeCharacters(universeCharacters)
      .build();

    segAnalytics.nestedArrays(nestedArrays);

    LargeNumbersEvent largeNumberEvent = new LargeNumbersEvent.Builder()
      .largeNullableOptionalInteger(1230007112658965944L)
      .largeNullableOptionalNumber(1240007112658965944331.0)
      .largeNullableRequiredInteger(1250007112658965944L)
      .largeNullableRequiredNumber(1260007112658965944331.0)
      .largeOptionalInteger(1270007112658965944L)
      .largeOptionalNumber(1280007112658965944331.0)
      .largeRequiredInteger(1290007112658965944L)
      .largeRequiredNumber(1300007112658965944331.0)
      .build();

    segAnalytics.largeNumbersEvent(largeNumberEvent);

    analytics.flush();

    for (int i = 0; i < 10; i++) {
      try {
        Thread.sleep(i * 1000);
        ShadowLooper looper = Shadows.shadowOf(Looper.getMainLooper());
        looper.runToEndOfTasks();

        Field statsField = Analytics.class.getDeclaredField("stats");
        statsField.setAccessible(true);
        Object statsObject = statsField.get(analytics);

        Field integrationsField = Analytics.class.getDeclaredField("integrations");
        integrationsField.setAccessible(true);
        Map integrationsObject = (Map) integrationsField.get(analytics);

        if (integrationsObject != null && integrationsObject.containsKey("Segment.io")) {
          Object segmentIntegration = integrationsObject.get("Segment.io");
          Field segmentThreadField = segmentIntegration.getClass().getDeclaredField("segmentThread");
          segmentThreadField.setAccessible(true);
          HandlerThread segmentThread = (HandlerThread) segmentThreadField.get(segmentIntegration);
          Shadows.shadowOf(segmentThread.getLooper()).getScheduler().advanceToNextPostedRunnable();
        }

        Field handlerField = statsObject.getClass().getDeclaredField("handler");
        handlerField.setAccessible(true);
        Handler handlerThread = (Handler) handlerField.get(statsObject);
        Shadows.shadowOf(handlerThread.getLooper()).getScheduler().advanceToNextPostedRunnable();

      } catch (Exception ignored) {
        // Catch and ignore so that we can retry.
      }
    }
  }
}
