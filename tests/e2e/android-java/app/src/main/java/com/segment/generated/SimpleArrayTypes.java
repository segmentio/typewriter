/**
* This client was automatically generated by Segment Typewriter. ** Do Not Edit **
*/
package com.segment.generated;

import java.util.*;
import com.segment.analytics.Properties;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public final class SimpleArrayTypes extends SerializableProperties {
  private Properties properties;

  
  private SimpleArrayTypes(Properties properties) {
    this.properties = properties;
	}

  protected Properties toProperties() {
    return properties;
	}
  

  /**
  * Builder for {@link SimpleArrayTypes }
  */
  public static class Builder {
    private Properties properties;

    /**
    * Builder for {@link SimpleArrayTypes }
    */
    public Builder() {
      properties = new Properties();
    }


    /**
     * This property is optional and not required to generate a valid SimpleArrayTypes object
     */
    public Builder any(final @Nullable List<Object> any) {
      List<?> p = TypewriterUtils.serialize(any);
      properties.putValue("any", p);
      return this;
    } 
    

    /**
     * This property is optional and not required to generate a valid SimpleArrayTypes object
     */
    public Builder boolean_(final @Nullable List<Boolean> boolean_) {
      List<?> p = TypewriterUtils.serialize(boolean_);
      properties.putValue("boolean", p);
      return this;
    } 
    

    /**
     * This property is optional and not required to generate a valid SimpleArrayTypes object
     */
    public Builder integer(final @Nullable List<Long> integer) {
      List<?> p = TypewriterUtils.serialize(integer);
      properties.putValue("integer", p);
      return this;
    } 
    

    /**
     * This property is optional and not required to generate a valid SimpleArrayTypes object
     */
    public Builder nullable(final @Nullable List<Object> nullable) {
      List<?> p = TypewriterUtils.serialize(nullable);
      properties.putValue("nullable", p);
      return this;
    } 
    

    /**
     * This property is optional and not required to generate a valid SimpleArrayTypes object
     */
    public Builder number(final @Nullable List<Double> number) {
      List<?> p = TypewriterUtils.serialize(number);
      properties.putValue("number", p);
      return this;
    } 
    

    /**
     * This property is optional and not required to generate a valid SimpleArrayTypes object
     */
    public Builder object(final @Nullable List<ObjectItem> object) {
      List<?> p = TypewriterUtils.serialize(object);
      properties.putValue("object", p);
      return this;
    } 
    

    /**
     * This property is optional and not required to generate a valid SimpleArrayTypes object
     */
    public Builder string(final @Nullable List<String> string) {
      List<?> p = TypewriterUtils.serialize(string);
      properties.putValue("string", p);
      return this;
    } 
    

    /**
    * Build an instance of {@link SimpleArrayTypes }
    */
    public SimpleArrayTypes build() {
      return new SimpleArrayTypes(properties);
    }
  }
}