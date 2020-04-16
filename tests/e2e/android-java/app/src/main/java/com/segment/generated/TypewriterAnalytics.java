/**
 * This client was automatically generated by Segment Typewriter. ** Do Not Edit **
 */
package com.segment.generated;

import java.util.*;
import com.segment.analytics.Analytics;
import com.segment.analytics.Options;
import com.segment.analytics.Properties;
import android.content.Context;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;


public class TypewriterAnalytics {
    private Analytics analytics;

    /**
     * Return a reference to the global default {@link TypewriterAnalytics} instance.
     *
     * This will use your the global default {@link Analytics} instance.
     *
     * If you want to use a different {@link Analytics} instance instance, see the
     * {@link TypewriterAnalytics} constructor below.
     */
    public static TypewriterAnalytics with(final Context context) {
        return new TypewriterAnalytics(Analytics.with(context));
    }

    /**
     * Initializes a new TypewriterAnalytics client wrapping the provided Segment Analytics client.
     *
     * You very likely want to use TypewriterAnalytics.with(context) method above instead, which
     * will utilize your existing singleton Segment {@link Analytics} instance.
     *
     * @param analytics {@link Analytics} configured Segment analytics instance
     * @see <a href="https://segment.com/docs/sources/mobile/android/#getting-started">Android Getting Started</a>
     */
    public TypewriterAnalytics(final @NonNull Analytics analytics) {
        this.analytics = analytics;
    }

    /**
     *Validates that clients properly sanitize event names.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void I42TerribleEventName3() {
        this.analytics.track("42_--terrible==\\\"event'++name~!3", new Properties(), TypewriterUtils.addTypewriterContext());
    }

    /**
     * Validates that clients properly sanitize event names.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void I42TerribleEventName3(final @Nullable Options options)  {
        this.analytics.track("42_--terrible==\\\"event'++name~!3", new Properties(), TypewriterUtils.addTypewriterContext(options));
    }
    /**
     *Fired before an analytics instance has been set, which should throw an error.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void analyticsInstanceMissing() {
        this.analytics.track("Analytics Instance Missing", new Properties(), TypewriterUtils.addTypewriterContext());
    }

    /**
     * Fired before an analytics instance has been set, which should throw an error.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void analyticsInstanceMissing(final @Nullable Options options)  {
        this.analytics.track("Analytics Instance Missing", new Properties(), TypewriterUtils.addTypewriterContext(options));
    }
    /**
     *Fired after a client throws an "Analytics Instance Missing" error to mark the test as successful.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void analyticsInstanceMissingThrewError() {
        this.analytics.track("Analytics Instance Missing Threw Error", new Properties(), TypewriterUtils.addTypewriterContext());
    }

    /**
     * Fired after a client throws an "Analytics Instance Missing" error to mark the test as successful.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void analyticsInstanceMissingThrewError(final @Nullable Options options)  {
        this.analytics.track("Analytics Instance Missing Threw Error", new Properties(), TypewriterUtils.addTypewriterContext(options));
    }
    /**
     *This event is fired in order to trigger a custom violation handler. It should be called with a JSON Schema violation.
     * @param props {@link CustomViolationHandler} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void customViolationHandler(final @Nullable CustomViolationHandler props) {
        this.analytics.track("Custom Violation Handler", props.toProperties(), TypewriterUtils.addTypewriterContext());
    }

    /**
     * This event is fired in order to trigger a custom violation handler. It should be called with a JSON Schema violation.
     * @param props {@link CustomViolationHandler} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void customViolationHandler(final @Nullable CustomViolationHandler props, final @Nullable Options options) {
        this.analytics.track("Custom Violation Handler", props.toProperties(), TypewriterUtils.addTypewriterContext(options));
    }
    /**
     *This event should be fired if a custom violation handler is correctly called due to a call to `Custom Violation Handler` with a violation.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void customViolationHandlerCalled() {
        this.analytics.track("Custom Violation Handler Called", new Properties(), TypewriterUtils.addTypewriterContext());
    }

    /**
     * This event should be fired if a custom violation handler is correctly called due to a call to `Custom Violation Handler` with a violation.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void customViolationHandlerCalled(final @Nullable Options options)  {
        this.analytics.track("Custom Violation Handler Called", new Properties(), TypewriterUtils.addTypewriterContext(options));
    }
    /**
     *This event is fired in order to trigger the default violation handler. It should be called with a JSON Schema violation.
     * @param props {@link DefaultViolationHandler} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void defaultViolationHandler(final @Nullable DefaultViolationHandler props) {
        this.analytics.track("Default Violation Handler", props.toProperties(), TypewriterUtils.addTypewriterContext());
    }

    /**
     * This event is fired in order to trigger the default violation handler. It should be called with a JSON Schema violation.
     * @param props {@link DefaultViolationHandler} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void defaultViolationHandler(final @Nullable DefaultViolationHandler props, final @Nullable Options options) {
        this.analytics.track("Default Violation Handler", props.toProperties(), TypewriterUtils.addTypewriterContext(options));
    }
    /**
     *This event should be fired if the default violation handler is correctly called due to a call to `Default Violation Handler` with a violation.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void defaultViolationHandlerCalled() {
        this.analytics.track("Default Violation Handler Called", new Properties(), TypewriterUtils.addTypewriterContext());
    }

    /**
     * This event should be fired if the default violation handler is correctly called due to a call to `Default Violation Handler` with a violation.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void defaultViolationHandlerCalled(final @Nullable Options options)  {
        this.analytics.track("Default Violation Handler Called", new Properties(), TypewriterUtils.addTypewriterContext(options));
    }
    /**
     *Validates that a generated client supports events with no explicit properties. It is expected that this event accepts ANY properties.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void emptyEvent() {
        this.analytics.track("Empty Event", new Properties(), TypewriterUtils.addTypewriterContext());
    }

    /**
     * Validates that a generated client supports events with no explicit properties. It is expected that this event accepts ANY properties.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void emptyEvent(final @Nullable Options options)  {
        this.analytics.track("Empty Event", new Properties(), TypewriterUtils.addTypewriterContext(options));
    }
    /**
     *Validates that client property sanitize enums.
     * @param props {@link EnumTypes} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void enumTypes(final @Nullable EnumTypes props) {
        this.analytics.track("Enum Types", props.toProperties(), TypewriterUtils.addTypewriterContext());
    }

    /**
     * Validates that client property sanitize enums.
     * @param props {@link EnumTypes} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void enumTypes(final @Nullable EnumTypes props, final @Nullable Options options) {
        this.analytics.track("Enum Types", props.toProperties(), TypewriterUtils.addTypewriterContext(options));
    }
    /**
     *Validates that a generated client handles even naming collisions.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void eventCollided() {
        this.analytics.track("Event Collided", new Properties(), TypewriterUtils.addTypewriterContext());
    }

    /**
     * Validates that a generated client handles even naming collisions.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void eventCollided(final @Nullable Options options)  {
        this.analytics.track("Event Collided", new Properties(), TypewriterUtils.addTypewriterContext(options));
    }
    /**
     *Validates that clients handle all of the supported field types, as nullable optional fields. If a field is null, it is expected to be NOT sent through.
     * @param props {@link EveryNullableOptionalType} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void everyNullableOptionalType(final @Nullable EveryNullableOptionalType props) {
        this.analytics.track("Every Nullable Optional Type", props.toProperties(), TypewriterUtils.addTypewriterContext());
    }

    /**
     * Validates that clients handle all of the supported field types, as nullable optional fields. If a field is null, it is expected to be NOT sent through.
     * @param props {@link EveryNullableOptionalType} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void everyNullableOptionalType(final @Nullable EveryNullableOptionalType props, final @Nullable Options options) {
        this.analytics.track("Every Nullable Optional Type", props.toProperties(), TypewriterUtils.addTypewriterContext(options));
    }
    /**
     *Validates that clients handle all of the supported field types, as nullable required fields. If a field is null, it is expected to be sent through.
     * @param props {@link EveryNullableRequiredType} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void everyNullableRequiredType(final @Nullable EveryNullableRequiredType props) {
        this.analytics.track("Every Nullable Required Type", props.toProperties(), TypewriterUtils.addTypewriterContext());
    }

    /**
     * Validates that clients handle all of the supported field types, as nullable required fields. If a field is null, it is expected to be sent through.
     * @param props {@link EveryNullableRequiredType} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void everyNullableRequiredType(final @Nullable EveryNullableRequiredType props, final @Nullable Options options) {
        this.analytics.track("Every Nullable Required Type", props.toProperties(), TypewriterUtils.addTypewriterContext(options));
    }
    /**
     *Validates that clients handle all of the supported field types, as optional fields.
     * @param props {@link EveryOptionalType} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void everyOptionalType(final @Nullable EveryOptionalType props) {
        this.analytics.track("Every Optional Type", props.toProperties(), TypewriterUtils.addTypewriterContext());
    }

    /**
     * Validates that clients handle all of the supported field types, as optional fields.
     * @param props {@link EveryOptionalType} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void everyOptionalType(final @Nullable EveryOptionalType props, final @Nullable Options options) {
        this.analytics.track("Every Optional Type", props.toProperties(), TypewriterUtils.addTypewriterContext(options));
    }
    /**
     *Validates that clients handle all of the supported field types, as required fields. 
     * @param props {@link EveryRequiredType} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void everyRequiredType(final @Nullable EveryRequiredType props) {
        this.analytics.track("Every Required Type", props.toProperties(), TypewriterUtils.addTypewriterContext());
    }

    /**
     * Validates that clients handle all of the supported field types, as required fields. 
     * @param props {@link EveryRequiredType} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void everyRequiredType(final @Nullable EveryRequiredType props, final @Nullable Options options) {
        this.analytics.track("Every Required Type", props.toProperties(), TypewriterUtils.addTypewriterContext(options));
    }
    /**
     *Validates that clients correctly serialize large numbers (integers and floats).
     * @param props {@link LargeNumbersEvent} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void largeNumbersEvent(final @Nullable LargeNumbersEvent props) {
        this.analytics.track("Large Numbers Event", props.toProperties(), TypewriterUtils.addTypewriterContext());
    }

    /**
     * Validates that clients correctly serialize large numbers (integers and floats).
     * @param props {@link LargeNumbersEvent} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void largeNumbersEvent(final @Nullable LargeNumbersEvent props, final @Nullable Options options) {
        this.analytics.track("Large Numbers Event", props.toProperties(), TypewriterUtils.addTypewriterContext(options));
    }
    /**
     *Validates that clients handle arrays-within-arrays.
     * @param props {@link NestedArrays} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void nestedArrays(final @Nullable NestedArrays props) {
        this.analytics.track("Nested Arrays", props.toProperties(), TypewriterUtils.addTypewriterContext());
    }

    /**
     * Validates that clients handle arrays-within-arrays.
     * @param props {@link NestedArrays} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void nestedArrays(final @Nullable NestedArrays props, final @Nullable Options options) {
        this.analytics.track("Nested Arrays", props.toProperties(), TypewriterUtils.addTypewriterContext(options));
    }
    /**
     *Validates that clients handle objects-within-objects.
     * @param props {@link NestedObjects} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void nestedObjects(final @Nullable NestedObjects props) {
        this.analytics.track("Nested Objects", props.toProperties(), TypewriterUtils.addTypewriterContext());
    }

    /**
     * Validates that clients handle objects-within-objects.
     * @param props {@link NestedObjects} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void nestedObjects(final @Nullable NestedObjects props, final @Nullable Options options) {
        this.analytics.track("Nested Objects", props.toProperties(), TypewriterUtils.addTypewriterContext(options));
    }
    /**
     *Validates that clients handle collisions in property names within a single event.
     * @param props {@link PropertiesCollided} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void propertiesCollided(final @Nullable PropertiesCollided props) {
        this.analytics.track("Properties Collided", props.toProperties(), TypewriterUtils.addTypewriterContext());
    }

    /**
     * Validates that clients handle collisions in property names within a single event.
     * @param props {@link PropertiesCollided} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void propertiesCollided(final @Nullable PropertiesCollided props, final @Nullable Options options) {
        this.analytics.track("Properties Collided", props.toProperties(), TypewriterUtils.addTypewriterContext(options));
    }
    /**
     *Validates that clients handle collisions in object names across multiple events.
     * @param props {@link PropertyObjectNameCollision#1} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void propertyObjectNameCollision1(final @Nullable PropertyObjectNameCollision1 props) {
        this.analytics.track("Property Object Name Collision #1", props.toProperties(), TypewriterUtils.addTypewriterContext());
    }

    /**
     * Validates that clients handle collisions in object names across multiple events.
     * @param props {@link PropertyObjectNameCollision#1} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void propertyObjectNameCollision1(final @Nullable PropertyObjectNameCollision1 props, final @Nullable Options options) {
        this.analytics.track("Property Object Name Collision #1", props.toProperties(), TypewriterUtils.addTypewriterContext(options));
    }
    /**
     *Validates that clients handle collisions in object names across multiple events.
     * @param props {@link PropertyObjectNameCollision#2} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void propertyObjectNameCollision2(final @Nullable PropertyObjectNameCollision2 props) {
        this.analytics.track("Property Object Name Collision #2", props.toProperties(), TypewriterUtils.addTypewriterContext());
    }

    /**
     * Validates that clients handle collisions in object names across multiple events.
     * @param props {@link PropertyObjectNameCollision#2} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void propertyObjectNameCollision2(final @Nullable PropertyObjectNameCollision2 props, final @Nullable Options options) {
        this.analytics.track("Property Object Name Collision #2", props.toProperties(), TypewriterUtils.addTypewriterContext(options));
    }
    /**
     *Validates that clients sanitize property names that contain invalid identifier characters.
     * @param props {@link PropertySanitized} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void propertySanitized(final @Nullable PropertySanitized props) {
        this.analytics.track("Property Sanitized", props.toProperties(), TypewriterUtils.addTypewriterContext());
    }

    /**
     * Validates that clients sanitize property names that contain invalid identifier characters.
     * @param props {@link PropertySanitized} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void propertySanitized(final @Nullable PropertySanitized props, final @Nullable Options options) {
        this.analytics.track("Property Sanitized", props.toProperties(), TypewriterUtils.addTypewriterContext(options));
    }
    /**
     *Validates that clients support fields with various types of arrays.
     * @param props {@link SimpleArrayTypes} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void simpleArrayTypes(final @Nullable SimpleArrayTypes props) {
        this.analytics.track("Simple Array Types", props.toProperties(), TypewriterUtils.addTypewriterContext());
    }

    /**
     * Validates that clients support fields with various types of arrays.
     * @param props {@link SimpleArrayTypes} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void simpleArrayTypes(final @Nullable SimpleArrayTypes props, final @Nullable Options options) {
        this.analytics.track("Simple Array Types", props.toProperties(), TypewriterUtils.addTypewriterContext(options));
    }
    /**
     *Validates that clients support fields with multiple (union) types.
     * @param props {@link UnionType} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void unionType(final @Nullable UnionType props) {
        this.analytics.track("Union Type", props.toProperties(), TypewriterUtils.addTypewriterContext());
    }

    /**
     * Validates that clients support fields with multiple (union) types.
     * @param props {@link UnionType} to add extra information to this call.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void unionType(final @Nullable UnionType props, final @Nullable Options options) {
        this.analytics.track("Union Type", props.toProperties(), TypewriterUtils.addTypewriterContext(options));
    }
    /**
     *Validates that a generated client handles even naming collisions.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void eventCollided1() {
        this.analytics.track("event_collided", new Properties(), TypewriterUtils.addTypewriterContext());
    }

    /**
     * Validates that a generated client handles even naming collisions.
     * @see <a href="https://segment.com/docs/spec/track/">Track Documentation</a>
     */
    public void eventCollided1(final @Nullable Options options)  {
        this.analytics.track("event_collided", new Properties(), TypewriterUtils.addTypewriterContext(options));
    }
}
