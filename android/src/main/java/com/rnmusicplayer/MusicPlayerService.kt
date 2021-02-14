package com.rnmusicplayer

import android.content.ContentResolver
import android.content.Context
import android.media.AudioAttributes
import android.media.AudioManager
import android.media.MediaPlayer
import android.net.Uri
import android.os.Build
import android.provider.MediaStore
import android.util.Log
import com.rnmusicplayer.models.Audio
import com.rnmusicplayer.models.PlayerState
import java.io.File
import java.io.IOException
import kotlin.math.roundToInt


class MusicPlayerService : MediaPlayer.OnCompletionListener,
  MediaPlayer.OnPreparedListener, MediaPlayer.OnErrorListener, MediaPlayer.OnSeekCompleteListener,
  MediaPlayer.OnInfoListener, MediaPlayer.OnBufferingUpdateListener,
  AudioManager.OnAudioFocusChangeListener {

  private var mContext: Context;
  private var mediaPlayer: MediaPlayer? = null
  var audioList = ArrayList<Audio>()
  private var currentSongIndex = 0
  var playerState = PlayerState()

  constructor(reactContext: Context) {
    this.mContext = reactContext
  }

  fun initMediaPlayer() {
    mediaPlayer = MediaPlayer()
    //Set up MediaPlayer event listeners
    mediaPlayer?.setOnCompletionListener(this)
    mediaPlayer?.setOnErrorListener(this)
    mediaPlayer?.setOnPreparedListener(this)
    mediaPlayer?.setOnBufferingUpdateListener(this)
    mediaPlayer?.setOnSeekCompleteListener(this)
    mediaPlayer?.setOnInfoListener(this)
    //Reset so that the MediaPlayer is not pointing to another data source
    mediaPlayer?.reset()
    try {
      setDataSource(currentSongIndex)
    } catch (e: Exception) {
      e.printStackTrace()
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
      mediaPlayer?.setAudioAttributes(
        AudioAttributes.Builder()
          .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
          .build())
    } else {
      mediaPlayer?.setAudioStreamType(AudioManager.STREAM_MUSIC)
    }
  }

  fun loadAudio() {
    audioList.clear()
    val contentResolver: ContentResolver = mContext.contentResolver
    val musicUri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI
    val selection = MediaStore.Audio.Media.IS_MUSIC
    val musicCursor = contentResolver.query(musicUri, null, selection, null, null)
    if (musicCursor != null && musicCursor.count > 0) {
      while (musicCursor.moveToNext()) {
        val uri = musicCursor.getString(musicCursor.getColumnIndex(MediaStore.Audio.Media.DATA))
        val data = musicCursor.getString(musicCursor.getColumnIndex(MediaStore.Audio.Media.DATA))
        val title = musicCursor.getString(musicCursor.getColumnIndex(MediaStore.Audio.Media.TITLE))
        val album = musicCursor.getString(musicCursor.getColumnIndex(MediaStore.Audio.Media.ALBUM))
        val artist = musicCursor.getString(musicCursor.getColumnIndex(MediaStore.Audio.Media.ARTIST))
        // Save to audioList
        audioList.add(Audio(uri, data, title, album, artist))
      }
    }
    Log.d("AudioList", audioList.toString())
    musicCursor!!.close()
  }

  private fun setDataSource(songIndex: Int) {
    try {
      mediaPlayer?.setDataSource(mContext, Uri.fromFile(File(audioList[songIndex].uri)))
      mediaPlayer?.prepare()
    } catch (e: IOException) {
      e.printStackTrace()
    } catch (e: Exception) {
      e.printStackTrace()
    }
  }

  // Playing the music
  fun musicPlay() {
    mediaPlayer?.start()
  }

  // Pausing the music
  fun musicPause() {
    mediaPlayer?.pause()
  }

  // Stopping the music
  fun musicStop() {
    mediaPlayer?.stop()
  }

  // Next music
  fun next() {
    currentSongIndex = if (currentSongIndex < audioList.size - 1) currentSongIndex + 1 else 0
    playNewSong()
  }

  // Previous music
  fun previous() {
    currentSongIndex = if (currentSongIndex > 0) currentSongIndex - 1 else audioList.size - 1
    playNewSong()
  }

  private fun updatePlayerState() {
    playerState.isPlaying = mediaPlayer?.isPlaying ?: false
    playerState.author = audioList[currentSongIndex].artist
    playerState.playbackDuration = mediaPlayer?.duration ?: 0
    playerState.playbackPosition = mediaPlayer?.currentPosition ?: 0
    playerState.trackName = audioList[currentSongIndex].title
  }

  private fun playNewSong() {
    mediaPlayer!!.stop()
    mediaPlayer!!.reset()
    setDataSource(currentSongIndex)
    mediaPlayer!!.start()
  }

  fun getPlaybackTime(): Int? {
    val currentPosition = mediaPlayer?.currentPosition;
    if (currentPosition !== null) {
      return (currentPosition.toDouble() / 1000).roundToInt()
    }
    return 0;
  }

  fun getPlaybackDuration(): Int? {
    val duration = mediaPlayer?.duration;
    if (duration !== null) {
      return (duration.toDouble() / 1000).roundToInt()
    }
    return 0;
  }

  fun setPlaybackTime(time: Int) {
    mediaPlayer?.seekTo(time * 1000)
  }

  fun skipToBeginning() {
    mediaPlayer?.seekTo(0)
  }

  fun getVolume(): Double {
    val audioManager = mContext.getSystemService(Context.AUDIO_SERVICE) as AudioManager?
    val currentVolume = audioManager?.getStreamVolume(AudioManager.STREAM_MUSIC)
    val maxVolume = audioManager?.getStreamMaxVolume(AudioManager.STREAM_MUSIC)
    if (maxVolume != null && currentVolume != null) {
      return currentVolume.toDouble() / maxVolume
    }
    return 0.0
  }

  fun setVolume(volume: Double) {
    val audio = mContext.getSystemService(Context.AUDIO_SERVICE) as AudioManager?
    val currentVolume = audio?.getStreamVolume(AudioManager.STREAM_MUSIC)
    val maxVolume = audio?.getStreamMaxVolume(AudioManager.STREAM_MUSIC)
    if (maxVolume != null && currentVolume != null) {
      val multipliedVolume = (maxVolume * volume).toInt()
      audio?.setStreamVolume(AudioManager.STREAM_MUSIC, multipliedVolume, 0)
    }
  }

  fun currentSongTitle(): String? {
    return audioList[currentSongIndex].title
  }

  fun getCurrentPlaybackRate(): Float? {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      mediaPlayer?.playbackParams?.speed
    } else {
      1F
    }
  }

  fun getRepeatMode(): String {
    val isLooping = mediaPlayer?.isLooping
    return if (isLooping != null && isLooping == true) {
      "all"
    } else {
      "none"
    }
  }

  fun setRepeatMode(repeatMode: String) {
    if (mediaPlayer != null && mediaPlayer!!.isLooping != null) {
      if (repeatMode == "all") {
        mediaPlayer!!.isLooping = true
      }
      if (repeatMode == "none") {
        mediaPlayer!!.isLooping = false
      }
    }
  }

  fun isPlaying(): Boolean? {
    return mediaPlayer?.isPlaying
  }

  override fun onAudioFocusChange(focusChange: Int) {
    Log.i("LISTENER", "focusChange $focusChange")
  }

  override fun onBufferingUpdate(mp: MediaPlayer?, percent: Int) {
    Log.i("LISTENER", "onBufferingUpdate $percent")
  }

  override fun onCompletion(mp: MediaPlayer?) {
    next()
    updatePlayerState()
    Log.i("LISTENER", "onCompletion ")
  }

  override fun onError(mp: MediaPlayer?, what: Int, extra: Int): Boolean {
    updatePlayerState()
    Log.i("LISTENER", "onError ")
    return false
  }

  override fun onInfo(mp: MediaPlayer?, what: Int, extra: Int): Boolean {
    Log.i("LISTENER", "onInfo ")
    updatePlayerState()
    return false
  }

  override fun onPrepared(mp: MediaPlayer?) {
    Log.i("LISTENER", "onPrepared ")
    updatePlayerState()
  }

  override fun onSeekComplete(mp: MediaPlayer?) {
    Log.i("LISTENER", "onSeekComplete ")
  }

}
