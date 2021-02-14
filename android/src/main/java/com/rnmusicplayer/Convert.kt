package com.rnmusicplayer

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.rnmusicplayer.models.ReadablePOJO


class Convert {
  companion object {
    private fun toMap(readablePOJO: ReadablePOJO): ReadableMap? {
      return if (readablePOJO != null) {
        return readablePOJO.toReadableMap()
      } else {
        null
      }
    }

    fun toReadableArray(readablePOJOList: ArrayList<ReadablePOJO>): ReadableArray? {
      val array = Arguments.createArray()
      for (readablePOJO in readablePOJOList) {
        array.pushMap(toMap(readablePOJO))
      }
      return array
    }
  }
}
