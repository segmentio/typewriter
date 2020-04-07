package com.segment.generated;

import java.util.*;
import java.lang.String;
import androidx.annotation.NonNull;
import android.util.Log;

public final class ArraySerializer {

  protected static List<?> serialize(final @NonNull List<?> props){
    List p = new ArrayList<>();
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
}