/**
* This client was automatically generated by Segment Typewriter. ** Do Not Edit **
*/
package com.segment.generated;

import java.util.*;
import com.segment.analytics.Properties;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public final class OccupantsItem extends SerializableProperties {
  private Properties properties;

  private OccupantsItem(Properties properties) {
    this.properties = properties;
	}

  protected Properties toProperties() {
    return properties;
	}

  /**
  * Builder for {@link OccupantsItem}
  */
  public static class Builder {
    private Properties properties;

    /**
    * Builder for {@link OccupantsItem}
    */
    public Builder() {
      properties = new Properties();
    }


    /**
     * The name of this occupant.
     * This property is required to generate a valid OccupantsItem object
     */
    public Builder name(final @NonNull String name) {
      properties.putValue("name", name);
      return this;
    } 
    

    /**
    * Build an instance of {@link OccupantsItem}
    */
    public OccupantsItem build() {
      return new OccupantsItem(properties);
    }
  }
}