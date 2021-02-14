package com.rnmusicplayer

import android.util.Log
import com.facebook.react.bridge.*
import com.rnmusicplayer.models.ReadablePOJO


class RnMusicPlayerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  private var mediaPlayer = MusicPlayerService(reactContext);

  override fun getName(): String {
    return "MusicPlayer"
  }

  @ReactMethod
  fun play(promise: Promise) {
    mediaPlayer.musicPlay()
    promise.resolve(null)
  }

  @ReactMethod
  fun pause(promise: Promise) {
    mediaPlayer.musicPause()
    promise.resolve(null)
  }

  @ReactMethod
  fun stop(promise: Promise) {
    mediaPlayer.musicStop()
    promise.resolve(null)
  }

  @ReactMethod
  fun next(promise: Promise) {
    mediaPlayer.next()
    promise.resolve(null)
  }

  @ReactMethod
  fun previous(promise: Promise) {
    mediaPlayer.previous()
    promise.resolve(null)
  }

  @ReactMethod
  fun initializeMusicPlayer(promise: Promise) {
    mediaPlayer.loadAudio()
    mediaPlayer.initMediaPlayer()
    promise.resolve(null)
  }

  @ReactMethod
  fun getUserSongs(promise: Promise) {
    promise.resolve(Convert.toReadableArray(mediaPlayer.audioList as ArrayList<ReadablePOJO>))
  }

  @ReactMethod
  fun getPlayerState(promise: Promise) {
    promise.resolve(mediaPlayer.playerState.toReadableMap())
  }

  @ReactMethod
  fun getPlaybackTime(promise: Promise) {
    promise.resolve(mediaPlayer.getPlaybackTime())
  }

  @ReactMethod
  fun getPlaybackDuration(promise: Promise) {
    promise.resolve(mediaPlayer.getPlaybackDuration())
  }

  @ReactMethod
  fun setPlaybackTime(timeInSeconds: Int, promise: Promise) {
    mediaPlayer.setPlaybackTime(timeInSeconds)
    promise.resolve(null)
  }

  @ReactMethod
  fun getVolume(promise: Promise) {
    promise.resolve(mediaPlayer.getVolume())
  }

  @ReactMethod
  fun setVolume(volume: Double, promise: Promise) {
    mediaPlayer.setVolume(volume)
    promise.resolve(null)
  }

  @ReactMethod
  fun currentSongTitle(promise: Promise) {
    promise.resolve(mediaPlayer.currentSongTitle())
  }

  @ReactMethod
  fun getCurrentPlaybackRate(promise: Promise) {
    promise.resolve(mediaPlayer.getCurrentPlaybackRate())
  }

  @ReactMethod
  fun getRepeatMode(promise: Promise) {
    promise.resolve(mediaPlayer.getRepeatMode())
  }

  @ReactMethod
  fun setRepeatMode(repeatMode: String, promise: Promise) {
    mediaPlayer.setRepeatMode(repeatMode)
    promise.resolve(null)
  }

  @ReactMethod
  fun isPlaying(promise: Promise) {
    promise.resolve(mediaPlayer.isPlaying())
  }

  @ReactMethod
  fun skipToBeginning(promise: Promise) {
    promise.resolve(mediaPlayer.skipToBeginning())
  }

}
