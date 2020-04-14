/**
* This client was automatically generated by Segment Typewriter. ** Do Not Edit **
*/
package com.segment.generated;

import java.util.*;
import com.segment.analytics.Properties;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public final class CustomViolationHandler extends SerializableProperties {
  private Properties properties;

  private CustomViolationHandler(Properties properties) {
    this.properties = properties;
	}

  protected Properties toProperties() {
    return properties;
	}

  /**
  * Builder for {@link CustomViolationHandler}
  */
  public static class Builder {
    private Properties properties;

    /**
    * Builder for {@link CustomViolationHandler}
    */
    public Builder() {
      properties = new Properties();
    }


    /**
     * This property is required to generate a valid CustomViolationHandler object
     */
    public Builder regexProperty(final @NonNull String regexProperty) {
      properties.putValue("regex property", regexProperty);
      return this;
    } 
    

    /**
    * Build an instance of {@link CustomViolationHandler}
    */
    public CustomViolationHandler build() {
      return new CustomViolationHandler(properties);
    }
  }
}