/**
 * This client was automatically generated by Segment Typewriter. ** Do Not Edit **
 */
package com.segment.generated;

import java.util.*;
import com.segment.analytics.Properties;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public final class LargeNumbersEvent extends SerializableProperties {
    private Properties properties;

    private LargeNumbersEvent(Properties properties) {
        this.properties = properties;
    }

    protected Properties toProperties() {
        return properties;
    }

    /**
     * Builder for {@link LargeNumbersEvent}
     */
    public static class Builder {
        private Properties properties;

        /**
         * Builder for {@link LargeNumbersEvent}
         */
        public Builder() {
            properties = new Properties();
        }

        /**
         * This property is optional and not required to generate a valid LargeNumbersEvent object
         */
        public Builder largeNullableOptionalInteger(final @Nullable Long largeNullableOptionalInteger) {
          properties.putValue("large nullable optional integer", largeNullableOptionalInteger);
          
          return this;
        } 

        /**
         * This property is optional and not required to generate a valid LargeNumbersEvent object
         */
        public Builder largeNullableOptionalNumber(final @Nullable Double largeNullableOptionalNumber) {
          properties.putValue("large nullable optional number", largeNullableOptionalNumber);
          
          return this;
        } 

        /**
         * This property is required to generate a valid LargeNumbersEvent object
         */
        public Builder largeNullableRequiredInteger(final @Nullable Long largeNullableRequiredInteger) {
          properties.putValue("large nullable required integer", largeNullableRequiredInteger);
          
          return this;
        } 

        /**
         * This property is required to generate a valid LargeNumbersEvent object
         */
        public Builder largeNullableRequiredNumber(final @Nullable Double largeNullableRequiredNumber) {
          properties.putValue("large nullable required number", largeNullableRequiredNumber);
          
          return this;
        } 

        /**
         * This property is optional and not required to generate a valid LargeNumbersEvent object
         */
        public Builder largeOptionalInteger(final @Nullable Long largeOptionalInteger) {
          properties.putValue("large optional integer", largeOptionalInteger);
          
          return this;
        } 

        /**
         * This property is optional and not required to generate a valid LargeNumbersEvent object
         */
        public Builder largeOptionalNumber(final @Nullable Double largeOptionalNumber) {
          properties.putValue("large optional number", largeOptionalNumber);
          
          return this;
        } 

        /**
         * This property is required to generate a valid LargeNumbersEvent object
         */
        public Builder largeRequiredInteger(final @NonNull Long largeRequiredInteger) {
          properties.putValue("large required integer", largeRequiredInteger);
          
          return this;
        } 

        /**
         * This property is required to generate a valid LargeNumbersEvent object
         */
        public Builder largeRequiredNumber(final @NonNull Double largeRequiredNumber) {
          properties.putValue("large required number", largeRequiredNumber);
          
          return this;
        } 

        /**
         * Build an instance of {@link LargeNumbersEvent}
         */
        public LargeNumbersEvent build() {
            if(properties.get("large required integer") == null){
              throw new IllegalArgumentException("LargeNumbersEvent missing required property: large required integer");
            }
            if(properties.get("large required number") == null){
              throw new IllegalArgumentException("LargeNumbersEvent missing required property: large required number");
            }
          return new LargeNumbersEvent(properties);
        }
    }
}
