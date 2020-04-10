/**
* This client was automatically generated by Segment Typewriter. ** Do Not Edit **
*/
package com.segment.generated;

import java.util.*;
import com.segment.analytics.Properties;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public final class SubterraneanLab extends Serializable {
  private Properties properties;

  
  private SubterraneanLab(Properties properties) {
    this.properties = properties;
	}

  protected Properties toProperties() {
    return properties;
	}
  

  /**
  * Builder for {@link SubterraneanLab}
  */
  public static class Builder {
    private Properties properties;

    /**
    * Builder for {@link SubterraneanLab}
    */
    public Builder() {
      properties = new Properties();
    }


    /**
     */
    public Builder jerrysMemories(final @Nullable List<Object> jerrysMemories) {
      List<?> p = TypewriterUtils.serialize(jerrysMemories);
      properties.putValue("jerry's memories", p);
      return this;
    } 
    

    /**
     */
    public Builder mortysMemories(final @Nullable List<Object> mortysMemories) {
      List<?> p = TypewriterUtils.serialize(mortysMemories);
      properties.putValue("morty's memories", p);
      return this;
    } 
    

    /**
     */
    public Builder summersContingencyPlan(final @Nullable String summersContingencyPlan) {
      properties.putValue("summer's contingency plan", summersContingencyPlan);
      return this;
    } 
    

    /**
    * Build an instance of {@link SubterraneanLab}
    */
    public SubterraneanLab build() {
      return new SubterraneanLab(properties);
    }
  }
}