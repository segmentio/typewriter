/**
* This client was automatically generated by Segment Typewriter. ** Do Not Edit **
*/
package com.segment.generated;

import java.util.*;
import com.segment.analytics.Properties;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public final class EnumTypes extends SerializableProperties {
  private Properties properties;

  private EnumTypes(Properties properties) {
    this.properties = properties;
	}

  protected Properties toProperties() {
    return properties;
	}

  /**
  * Builder for {@link EnumTypes}
  */
  public static class Builder {
    private Properties properties;

    /**
    * Builder for {@link EnumTypes}
    */
    public Builder() {
      properties = new Properties();
    }


    /**
     * A string property that only accepts a single enum value.
     * This property is optional and not required to generate a valid EnumTypes object
     */
    public Builder stringConst(final @Nullable String stringConst) {
      properties.putValue("string const", stringConst);
      return this;
    } 
    

    /**
     * A string property that accepts multiple enum values.
     * This property is optional and not required to generate a valid EnumTypes object
     */
    public Builder stringEnum(final @Nullable String stringEnum) {
      properties.putValue("string enum", stringEnum);
      return this;
    } 
    

    /**
    * Build an instance of {@link EnumTypes}
    */
    public EnumTypes build() {
      return new EnumTypes(properties);
    }
  }
}