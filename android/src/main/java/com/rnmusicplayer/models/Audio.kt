package com.rnmusicplayer.models

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap

class Audio : ReadablePOJO {
  var uri: String? = null
  var data: String? = null
  var title: String? = null
  var album: String? = null
  var artist: String? = null

  constructor(uri: String?, data: String?, title: String?, album: String?, artist: String?) {
    this.uri = uri
    this.data = data
    this.title = title
    this.album = album
    this.artist = artist
  }

  override fun toReadableMap(): WritableMap {
    var map = Arguments.createMap()
    map.putString("uri", this.uri)
    map.putString("data", this.data)
    map.putString("title", this.title)
    map.putString("album", this.album)
    map.putString("artist", this.artist)
    return map
  }

  override fun toString(): String {
    return "Audio(uri=$uri, data=$data, title=$title, album=$album, artist=$artist)"
  }
}
