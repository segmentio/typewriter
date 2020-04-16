/**
 * This client was automatically generated by Segment Typewriter. ** Do Not Edit **
 */
package com.segment.generated;

import java.util.*;
import com.segment.analytics.Properties;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public final class OptionalObjectWithProperties1 extends SerializableProperties {
    private Properties properties;

    private OptionalObjectWithProperties1(Properties properties) {
        this.properties = properties;
    }

    protected Properties toProperties() {
        return properties;
    }

    /**
     * Builder for {@link OptionalObjectWithProperties1}
     */
    public static class Builder {
        private Properties properties;

        /**
         * Builder for {@link OptionalObjectWithProperties1}
         */
        public Builder() {
            properties = new Properties();
        }

        /**
         * Optional any property
         * This property is optional and not required to generate a valid OptionalObjectWithProperties1 object
         */
        public Builder optionalAny(final @Nullable Object optionalAny) {
            properties.putValue("optional any", optionalAny);
            
            return this;
        }

        /**
         * Optional array property
         * This property is optional and not required to generate a valid OptionalObjectWithProperties1 object
         */
        public Builder optionalArray(final @Nullable List<Object> optionalArray) {
            List<?> p = TypewriterUtils.serializeList(optionalArray);
            properties.putValue("optional array", p);

            return this;
        }

        /**
         * Optional boolean property
         * This property is optional and not required to generate a valid OptionalObjectWithProperties1 object
         */
        public Builder optionalBoolean(final @Nullable Boolean optionalBoolean) {
            properties.putValue("optional boolean", optionalBoolean);
            
            return this;
        }

        /**
         * Optional integer property
         * This property is optional and not required to generate a valid OptionalObjectWithProperties1 object
         */
        public Builder optionalInt(final @Nullable Long optionalInt) {
            properties.putValue("optional int", optionalInt);
            
            return this;
        }

        /**
         * Optional number property
         * This property is optional and not required to generate a valid OptionalObjectWithProperties1 object
         */
        public Builder optionalNumber(final @Nullable Double optionalNumber) {
            properties.putValue("optional number", optionalNumber);
            
            return this;
        }

        /**
         * Optional object property
         * This property is optional and not required to generate a valid OptionalObjectWithProperties1 object
         */
        public Builder optionalObject(final @Nullable Object optionalObject) {
            properties.putValue("optional object", optionalObject);
            
            return this;
        }

        /**
         * Optional string property
         * This property is optional and not required to generate a valid OptionalObjectWithProperties1 object
         */
        public Builder optionalString(final @Nullable String optionalString) {
            properties.putValue("optional string", optionalString);
            
            return this;
        }

        /**
         * Optional string property with a regex conditional
         * This property is optional and not required to generate a valid OptionalObjectWithProperties1 object
         */
        public Builder optionalStringWithRegex(final @Nullable String optionalStringWithRegex) {
            properties.putValue("optional string with regex", optionalStringWithRegex);
            
            return this;
        }

        /**
         * Build an instance of {@link OptionalObjectWithProperties1}
         */
        public OptionalObjectWithProperties1 build() {
            return new OptionalObjectWithProperties1(properties);
        }
    }
}
