/**
 * This client was automatically generated by Segment Typewriter. ** Do Not Edit **
 */
package com.segment.generated;

import java.util.*;
import com.segment.analytics.Properties;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public final class DefaultViolationHandler extends SerializableProperties {
    private Properties properties;

    private DefaultViolationHandler(Properties properties) {
        this.properties = properties;
    }

    protected Properties toProperties() {
        return properties;
    }

    /**
     * Builder for {@link DefaultViolationHandler}
     */
    public static class Builder {
        private Properties properties;

        /**
         * Builder for {@link DefaultViolationHandler}
         */
        public Builder() {
            properties = new Properties();
        }

        /**
         * This property is required to generate a valid DefaultViolationHandler object
         */
        public Builder regexProperty(final @NonNull String regexProperty) {
          properties.putValue("regex property", regexProperty);
          
          return this;
        } 

        /**
         * Build an instance of {@link DefaultViolationHandler}
         */
        public DefaultViolationHandler build() {
            if(properties.get("regex property") == null){
              throw new IllegalArgumentException("DefaultViolationHandler missing required property: regex property");
            }
          return new DefaultViolationHandler(properties);
        }
    }
}
