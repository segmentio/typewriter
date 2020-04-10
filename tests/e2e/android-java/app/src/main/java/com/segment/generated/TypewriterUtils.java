package com.segment.generated;

import com.segment.analytics.Options;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.lang.String;
import androidx.annotation.Nullable;
import androidx.annotation.NonNull;

public final class TypewriterUtils {


  protected static ConcurrentHashMap getTypewriterInfo(){
    ConcurrentHashMap<String, String> typewriterInfo = new ConcurrentHashMap<>();
    try{
      typewriterInfo.put("version", "7.0.1");
      typewriterInfo.put("language", "java");
      return typewriterInfo;
    }catch(Throwable e){
      return typewriterInfo;
    }
  }

  protected static Options mergeOptions(final @NonNull Options options){
    options.putContext("typewriter", getTypewriterInfo());
    return options;
  }

  protected static Options mergeOptions(){
    
    Options typewriterContext = new Options();
    typewriterContext.putContext("typewriter", getTypewriterInfo());
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