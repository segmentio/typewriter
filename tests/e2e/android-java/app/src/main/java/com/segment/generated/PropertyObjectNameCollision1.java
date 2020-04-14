/**
* This client was automatically generated by Segment Typewriter. ** Do Not Edit **
*/
package com.segment.generated;

import java.util.*;
import com.segment.analytics.Properties;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public final class PropertyObjectNameCollision1 extends SerializableProperties {
  private Properties properties;

  
  private PropertyObjectNameCollision1(Properties properties) {
    this.properties = properties;
	}

  protected Properties toProperties() {
    return properties;
	}
  

  /**
  * Builder for {@link PropertyObjectNameCollision1 }
  */
  public static class Builder {
    private Properties properties;

    /**
    * Builder for {@link PropertyObjectNameCollision1 }
    */
    public Builder() {
      properties = new Properties();
    }


    /**
     * This property is optional and not required to generate a valid PropertyObjectNameCollision1 object
     */
    public Builder universe(final @Nullable Universe universe) {
      if(universe instanceof SerializableProperties){
        properties.putValue("universe", ((SerializableProperties) universe).toProperties());
      }else{
        properties.putValue("universe", universe);
      }
      return this;
    } 
    

    /**
    * Build an instance of {@link PropertyObjectNameCollision1 }
    */
    public PropertyObjectNameCollision1 build() {
      return new PropertyObjectNameCollision1(properties);
    }
  }
}