package com.segment.generated;

import com.segment.analytics.Options;
import java.util.*;
import java.lang.String;
import androidx.annotation.Nullable;
import androidx.annotation.NonNull;

public final class TypewriterUtils {
  protected static Map<String, String> typewriterCtx;

  static {
    typewriterCtx = new HashMap<String, String>();
    typewriterCtx.put("version", "7.0.1");
    typewriterCtx.put("language", "java");
  }

  protected static Options addTypewriterContext(final @NonNull Options options){
    options.putContext("typewriter", typewriterCtx);
    return options;
  }

  protected static Options addTypewriterContext(){
    Options typewriterContext = new Options();
    typewriterContext.putContext("typewriter", typewriterCtx);
    return typewriterContext;
  }

  protected static List<?> serialize(final @NonNull List<?> props){
    List p = new ArrayList<>();
    if(props instanceof List){
      for(Object item : props) {
        if(item instanceof List) {
          p.add(serialize((List) item));
        } else if(item instanceof Serializable){
          p.add(((Serializable) item).toProperties());
        }else{
          p.add(item);
        }
      }
      return p;
    }
    return props;
  }
}