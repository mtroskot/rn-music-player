package com.rnmusicplayer.models

import com.facebook.react.bridge.WritableMap

abstract class ReadablePOJO {
  abstract fun toReadableMap(): WritableMap
}
