/**
* This client was automatically generated by Segment Typewriter. ** Do Not Edit **
*/
package com.segment.generated;

import java.util.*;
import com.segment.analytics.Properties;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public final class PropertiesCollided extends SerializableProperties {
  private Properties properties;

  
  private PropertiesCollided(Properties properties) {
    this.properties = properties;
	}

  protected Properties toProperties() {
    return properties;
	}
  

  /**
  * Builder for {@link PropertiesCollided}
  */
  public static class Builder {
    private Properties properties;

    /**
    * Builder for {@link PropertiesCollided}
    */
    public Builder() {
      properties = new Properties();
    }


    /**
     * This property is required to generate a valid PropertiesCollided object
     */
    public Builder propertyCollided(final @NonNull String propertyCollided) {
      properties.putValue("Property Collided", propertyCollided);
      return this;
    } 
    

    /**
     * This property is required to generate a valid PropertiesCollided object
     */
    public Builder propertyCollided1(final @NonNull String propertyCollided1) {
      properties.putValue("property_collided", propertyCollided1);
      return this;
    } 
    

    /**
    * Build an instance of {@link PropertiesCollided}
    */
    public PropertiesCollided build() {
      if(properties.get("Property Collided") == null){
        throw new IllegalArgumentException("PropertiesCollided missing required property: Property Collided");
      }
  
      if(properties.get("property_collided") == null){
        throw new IllegalArgumentException("PropertiesCollided missing required property: property_collided");
      }
  
      return new PropertiesCollided(properties);
    }
  }
}