/**
* This client was automatically generated by Segment Typewriter. ** Do Not Edit **
*/
package com.segment.generated;

import java.util.*;
import com.segment.analytics.Properties;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public final class Universe1 extends SerializableProperties {
  private Properties properties;

  
  private Universe1(Properties properties) {
    this.properties = properties;
	}

  protected Properties toProperties() {
    return properties;
	}
  

  /**
  * Builder for {@link Universe1}
  */
  public static class Builder {
    private Properties properties;

    /**
    * Builder for {@link Universe1}
    */
    public Builder() {
      properties = new Properties();
    }


    /**
     * The common name of this universe.
     * This property is required to generate a valid Universe1 object
     */
    public Builder name(final @NonNull String name) {
      properties.putValue("name", name);
      return this;
    } 
    

    /**
     * The most important occupants in this universe.
     * This property is required to generate a valid Universe1 object
     */
    public Builder occupants(final @NonNull List<OccupantsItem1> occupants) {
      List<?> p = TypewriterUtils.serialize(occupants);
      properties.putValue("occupants", p);
      return this;
    } 
    

    /**
    * Build an instance of {@link Universe1}
    */
    public Universe1 build() {
      if(properties.get("name") == null){
        throw new IllegalArgumentException("Universe1 missing required property: name");
      }
  
      if(properties.get("occupants") == null){
        throw new IllegalArgumentException("Universe1 missing required property: occupants");
      }
  
      return new Universe1(properties);
    }
  }
}