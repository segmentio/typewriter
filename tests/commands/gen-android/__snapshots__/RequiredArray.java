// This code is auto-generated by Segment Typewriter. Do not edit.
package com.segment.analytics;

import java.util.*;
import android.support.annotation.NonNull;

public final class RequiredArray {
    private Properties properties;

    private RequiredArray(Properties properties) {
        this.properties = properties;
    }

    protected Properties toProperties() {
        return properties;
    }

    /**
     * Builder for {@link RequiredArray}
     */
    public static class Builder {
        private Properties properties;

        /**
         * Builder for {@link RequiredArray}
         */
        public Builder() {
            properties = new Properties();
        }

        /**
         * Optional sub-property
         * This property is optional and not required to generate a valid RequiredArray object
         */
        public Builder optionalSubProperty(final @NonNull String optionalSubProperty) {
            properties.putValue("optional sub-property", optionalSubProperty);
            return this;
        }

        /**
         * Required sub-property
         * This property is required to generate a valid RequiredArray object
         */
        public Builder requiredSubProperty(final @NonNull String requiredSubProperty) {
            properties.putValue("required sub-property", requiredSubProperty);
            return this;
        }

        /**
         * Build an instance of {@link RequiredArray}
         * Performs runtime validation on the following required properties:
         *  - requiredSubProperty
         */
        public RequiredArray build() {
            if (properties.get("required sub-property") == null) {
                throw new IllegalArgumentException("RequiredArray missing required property: requiredSubProperty");
            }

            return new RequiredArray(properties);
        }
    }
}
