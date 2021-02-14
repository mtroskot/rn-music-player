package com.rnmusicplayer.models

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap

class PlayerState : ReadablePOJO {
  var playbackStoreID: String? = null
  var trackName: String? = null
  var author: String? = null
  var playbackDuration: Int = 0
  var playbackPosition: Int = 0
  var isPlaying: Boolean = false
  var artwork: String? = null

  constructor()
  constructor(playbackStoreID: String?, trackName: String?, author: String?, playbackDuration: Int, playbackPosition: Int, isPlaying: Boolean, artwork: String?) {
    this.playbackStoreID = playbackStoreID
    this.trackName = trackName
    this.author = author
    this.playbackDuration = playbackDuration
    this.playbackPosition = playbackPosition
    this.isPlaying = isPlaying
    this.artwork = artwork
  }

  override fun toReadableMap(): WritableMap {
    var map = Arguments.createMap()
    map.putString("playbackStoreID", this.playbackStoreID)
    map.putString("trackName", this.trackName)
    map.putString("author", this.author)
    map.putInt("playbackDuration", this.playbackDuration)
    map.putInt("playbackPosition", this.playbackPosition)
    map.putBoolean("isPlaying", this.isPlaying)
    map.putString("artwork", this.artwork)
    return map
  }

  override fun toString(): String {
    return "PlayerState(playbackStoreID=$playbackStoreID, trackName=$trackName, author=$author, playbackDuration=$playbackDuration, playbackPosition=$playbackPosition, isPlaying=$isPlaying, artwork=$artwork)"
  }

}
