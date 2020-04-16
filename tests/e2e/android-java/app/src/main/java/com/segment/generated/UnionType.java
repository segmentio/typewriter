/**
 * This client was automatically generated by Segment Typewriter. ** Do Not Edit **
 */
package com.segment.generated;

import java.util.*;
import com.segment.analytics.Properties;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public final class UnionType extends SerializableProperties {
    private Properties properties;

    private UnionType(Properties properties) {
        this.properties = properties;
    }

    protected Properties toProperties() {
        return properties;
    }

    /**
     * Builder for {@link UnionType}
     */
    public static class Builder {
        private Properties properties;

        /**
         * Builder for {@link UnionType}
         */
        public Builder() {
            properties = new Properties();
        }

        /**
         * This property is required to generate a valid UnionType object
         */
        public Builder universeName(final @Nullable Object universeName) {
            properties.putValue("universe_name", universeName);
            
            return this;
        }

        /**
         * Build an instance of {@link UnionType}
         */
        public UnionType build() {
            return new UnionType(properties);
        }
    }
}
