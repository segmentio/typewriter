/**
* This client was automatically generated by Segment Typewriter. ** Do Not Edit **
*/
package com.segment.generated;

import java.util.*;
import com.segment.analytics.Properties;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public final class ObjectItem extends SerializableProperties {
  private Properties properties;

  
  private ObjectItem(Properties properties) {
    this.properties = properties;
	}

  protected Properties toProperties() {
    return properties;
	}
  

  /**
  * Builder for {@link ObjectItem}
  */
  public static class Builder {
    private Properties properties;

    /**
    * Builder for {@link ObjectItem}
    */
    public Builder() {
      properties = new Properties();
    }


    /**
     */
    public Builder name(final @Nullable String name) {
      properties.putValue("name", name);
      return this;
    } 
    

    /**
    * Build an instance of {@link ObjectItem}
    */
    public ObjectItem build() {
      return new ObjectItem(properties);
    }
  }
}