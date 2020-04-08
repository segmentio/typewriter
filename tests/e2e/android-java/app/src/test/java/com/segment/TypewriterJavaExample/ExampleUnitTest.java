package com.segment.TypewriterJavaExample;

import com.segment.generated.*;
import com.segment.analytics.Analytics;

import android.content.Context;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import android.util.Log;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;
import androidx.test.core.app.ApplicationProvider;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = 27, application = TestApp.class)
public class ExampleUnitTest {

  @Test
  public void exampleTests() {
    Context ctx = ApplicationProvider.getApplicationContext();
    final Analytics analytics = Analytics.with(ctx);
    SEGTypewriterAnalytics segAnalytics = new SEGTypewriterAnalytics(analytics);

    List defaultArray = Arrays.asList(137, "C-137");
    Object defaultObject = new Object();

    segAnalytics.emptyEvent();

    RequiredArrayWithPropertiesItem1 requiredArrayWithPropertiesItem = new RequiredArrayWithPropertiesItem1.Builder()
        .requiredAny("Rick Sanchez").requiredArray(defaultArray).requiredBoolean(false).requiredInt(97L)
        .requiredNumber(3.14).requiredObject(defaultObject).requiredString("Alpha-Betrium")
        .requiredStringWithRegex("Lawyer Mort").build();

    RequiredObjectWithProperties1 requiredObjectWithProperties = new RequiredObjectWithProperties1.Builder()
        .requiredAny("Rick Sanchez").requiredArray(defaultArray).requiredBoolean(false).requiredInt(97L)
        .requiredNumber(3.14).requiredObject(defaultObject).requiredString("Alpha-Betrium")
        .requiredStringWithRegex("Lawyer Mort").build();

    EveryRequiredType everyRequiredType = new EveryRequiredType.Builder().requiredAny("Rick Sanchez")
        .requiredArray(defaultArray).requiredArrayWithProperties(Arrays.asList(requiredArrayWithPropertiesItem))
        .requiredBoolean(false).requiredInt(97L).requiredNumber(3.14).requiredObject(defaultObject)
        .requiredObjectWithProperties(requiredObjectWithProperties).requiredString("Alpha-Betrium")
        .requiredStringWithRegex("Lawyer Morty").build();

    segAnalytics.everyRequiredType(everyRequiredType);

    OptionalArrayWithPropertiesItem1 optionalArrayWithProperties = new OptionalArrayWithPropertiesItem1.Builder()
        .optionalArray(defaultArray).optionalBoolean(false).optionalInt(97L).optionalNumber(3.14)
        .optionalObject(defaultObject).optionalString("Alpha-Betrium").optionalStringWithRegex("Lawyer Morty").build();

    OptionalObjectWithProperties1 optionalObjectWithProperties = new OptionalObjectWithProperties1.Builder()
        .optionalAny("Rick Sanchez").optionalArray(defaultArray).optionalBoolean(false).optionalInt(97L)
        .optionalNumber(3.14).optionalObject(defaultObject).optionalString("Alpha-Betrium")
        .optionalStringWithRegex("Lawyer Morty").build();

    EveryOptionalType everyOptionalType = new EveryOptionalType.Builder().optionalAny("Rick Sanchez")
        .optionalArray(defaultArray).optionalArrayWithProperties(Arrays.asList(optionalArrayWithProperties))
        .optionalBoolean(false).optionalInt(97L).optionalNumber(3.14).optionalObject(defaultObject)
        .optionalObjectWithProperties(optionalObjectWithProperties).optionalString("Alpha-Betrium")
        .optionalStringWithRegex("Lawyer Morty").build();

    segAnalytics.everyOptionalType(everyOptionalType);

    RequiredArrayWithPropertiesItem nullableRequiredArrayWithPropertiesItem = new RequiredArrayWithPropertiesItem.Builder()
        .requiredAny("RickSanchez").requiredArray(defaultArray).requiredBoolean(false).requiredInt(97L)
        .requiredNumber(3.14).requiredObject(defaultObject).requiredString("Alpha-Betrium")
        .requiredStringWithRegex("Lawyer Morty").build();

    RequiredObjectWithProperties nullableRequiredObjectWithProperties = new RequiredObjectWithProperties.Builder()
        .requiredAny("RickSanchez").requiredArray(defaultArray).requiredBoolean(false).requiredInt(97L)
        .requiredNumber(3.14).requiredObject(defaultObject).requiredString("Alpha-Betrium")
        .requiredStringWithRegex("Lawyer Morty").build();

    EveryNullableRequiredType everyNullableRequiredType = new EveryNullableRequiredType.Builder()
        .requiredAny("RickSanchez").requiredArray(defaultArray)
        .requiredArrayWithProperties(Arrays.asList(nullableRequiredArrayWithPropertiesItem)).requiredBoolean(false)
        .requiredInt(97L).requiredNumber(3.14).requiredObject(defaultObject)
        .requiredObjectWithProperties(nullableRequiredObjectWithProperties).requiredString("Alpha-Betrium")
        .requiredStringWithRegex("Lawyer Morty").build();

    segAnalytics.everyNullableRequiredType(everyNullableRequiredType);

    EveryNullableOptionalType everyNullableOptionalType = new EveryNullableOptionalType.Builder().optionalAny(null)
        .optionalArray(null).optionalArrayWithProperties(null).optionalBoolean(null).optionalInt(null)
        .optionalNumber(null).optionalObject(null).optionalObjectWithProperties(null).optionalString(null)
        .optionalStringWithRegex(null).build();

    segAnalytics.everyNullableOptionalType(everyNullableOptionalType);

    OptionalArrayWithPropertiesItem nullableOptionalArrayWithProperties = new OptionalArrayWithPropertiesItem.Builder()
        .optionalArray(defaultArray).optionalBoolean(false).optionalInt(97L).optionalNumber(3.14)
        .optionalObject(defaultObject).optionalString("Alpha-Betrium").optionalStringWithRegex("Lawyer Morty").build();

    OptionalObjectWithProperties nullableOptionalObjectWithProperties = new OptionalObjectWithProperties.Builder()
        .optionalAny("Rick Sanchez").optionalArray(defaultArray).optionalBoolean(false).optionalInt(97L)
        .optionalNumber(3.14).optionalObject(defaultObject).optionalString("Alpha-Betrium")
        .optionalStringWithRegex("Lawyer Morty").build();

    EveryNullableOptionalType everyNullableOptionalTypeComplete = new EveryNullableOptionalType.Builder()
        .optionalAny(null).optionalArray(null)
        .optionalArrayWithProperties(Arrays.asList(nullableOptionalArrayWithProperties)).optionalBoolean(null)
        .optionalInt(null).optionalNumber(null).optionalObject(null)
        .optionalObjectWithProperties(nullableOptionalObjectWithProperties).optionalString(null)
        .optionalStringWithRegex(null).build();

    segAnalytics.everyNullableOptionalType(everyNullableOptionalTypeComplete);

    segAnalytics.I42TerribleEventName3();

    PropertySanitized propertySanitized = new PropertySanitized.Builder()
        .I0000TerriblePropertyName3("what a cronenberg").build();

    segAnalytics.propertySanitized(propertySanitized);

    segAnalytics.eventCollided();
    segAnalytics.eventCollided1();

    PropertiesCollided propertiesCollided = new PropertiesCollided.Builder().propertyCollided("The Citadel")
        .propertyCollided1("Galactic Prison").build();

    segAnalytics.propertiesCollided(propertiesCollided);

    OccupantsItem beth = new OccupantsItem.Builder().name("Beth Smith").build();

    OccupantsItem thomas = new OccupantsItem.Builder().name("Thomas Lipkip").build();

    Universe universe = new Universe.Builder().name("Froopyland").occupants(Arrays.asList(beth, thomas)).build();

    PropertyObjectNameCollision1 propertyObjectNameCollision1 = new PropertyObjectNameCollision1.Builder()
        .universe(universe).build();

    segAnalytics.propertyObjectNameCollision1(propertyObjectNameCollision1);

    OccupantsItem1 beth1 = new OccupantsItem1.Builder().name("Beth Smith").build();

    OccupantsItem1 thomas1 = new OccupantsItem1.Builder().name("Thomas Lipkip").build();

    Universe1 universe2 = new Universe1.Builder().name("Froopyland").occupants(Arrays.asList(beth1, thomas1)).build();

    PropertyObjectNameCollision2 propertyObjectNameCollision2 = new PropertyObjectNameCollision2.Builder()
        .universe(universe2).build();

    segAnalytics.propertyObjectNameCollision2(propertyObjectNameCollision2);

    ObjectItem objectItem = new ObjectItem.Builder().name("Beth Smith").build();

    List<Object> nullable = new ArrayList();

    nullable.add(null);

    SimpleArrayTypes simpleArrayTypes = new SimpleArrayTypes.Builder().any(defaultArray)
        .boolean_(Arrays.asList(true, false)).integer(Arrays.asList(97L)).nullable(nullable).number(Arrays.asList(3.14))
        .object(Arrays.asList(objectItem)).string(Arrays.asList("Alpha-Betrium")).build();

    segAnalytics.simpleArrayTypes(simpleArrayTypes);

    List jMem = new ArrayList();
    List mMem = new ArrayList();

    SubterraneanLab lab = new SubterraneanLab.Builder().jerrysMemories(jMem).mortysMemories(mMem)
        .summersContingencyPlan("Oh, man, it’s a scenario four.").build();

    Tunnel tunnel = new Tunnel.Builder().subterraneanLab(lab).build();

    Garage garage = new Garage.Builder().tunnel(tunnel).build();

    NestedObjects nestedObjectsWithGarage = new NestedObjects.Builder().garage(garage).build();

    segAnalytics.nestedObjects(nestedObjectsWithGarage);

    UniverseCharactersItemItem morty = new UniverseCharactersItemItem.Builder().name("Morty Smith").build();

    UniverseCharactersItemItem rick = new UniverseCharactersItemItem.Builder().name("Rick Sanchez").build();

    UniverseCharactersItemItem mortyCron = new UniverseCharactersItemItem.Builder().name("Cronenberg Morty").build();

    UniverseCharactersItemItem rickCron = new UniverseCharactersItemItem.Builder().name("Cronenberg Rick").build();

    List<List<UniverseCharactersItemItem>> universeCharacters = Arrays.asList(Arrays.asList(morty, rick),
        Arrays.asList(mortyCron, rickCron));

    NestedArrays nestedArrays = new NestedArrays.Builder().universeCharacters(universeCharacters).build();

    segAnalytics.nestedArrays(nestedArrays);

    LargeNumbersEvent largeNumberEvent = new LargeNumbersEvent.Builder()
        .largeNullableOptionalInteger(1230007112658965944L).largeNullableOptionalNumber(1240007112658965944331.0)
        .largeNullableRequiredInteger(1250007112658965944L).largeNullableRequiredNumber(1260007112658965944331.0)
        .largeOptionalInteger(1270007112658965944L).largeOptionalNumber(1280007112658965944331.0)
        .largeRequiredInteger(1290007112658965944L).largeRequiredNumber(1300007112658965944331.0).build();

    segAnalytics.largeNumbersEvent(largeNumberEvent);

    ExecutorService executor = Executors.newFixedThreadPool(1);
    Runnable task = new Runnable(){
      public void run() {
        analytics.flush();
      }
    };

    executor.submit(task);
  }
}
