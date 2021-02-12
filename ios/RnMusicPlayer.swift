import Foundation
import MediaPlayer
import StoreKit

@objc(MusicPlayer)
class MusicPlayer: RCTEventEmitter {
    
    ///The music player controller instance.
    var player: MPMusicPlayerController = MPMusicPlayerController.systemMusicPlayer
    var emitter: RCTEventEmitter!
    var hasListeners:Bool=false;
    var playerState:PlayerState=PlayerState()
    let controller = SKCloudServiceController()
    
    override init() {
        super.init()
        emitter = self
    }
    
    deinit {
        removeObservers()
    }
    
    @objc override static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc override func supportedEvents() -> [String]! {
        return ["onPlay","onPause", "onNext","onStop", "onPrevious","onSongChange","systemVolumeDidChange"];
    }
    
    // Will be called when this module's first listener is added.
    @objc override func startObserving()->Void {
        self.hasListeners=true;
        addObservers();
    }
    // Will be called when this module's last listener is removed, or on dealloc.
    @objc override func stopObserving()->Void {
        self.hasListeners=false;
        removeObservers()
    }
    
    private func addObservers(){
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(self.systemSongDidChange),
            name: .MPMusicPlayerControllerNowPlayingItemDidChange,
            object: player
        )
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(self.playbackDidChange),
            name: .MPMusicPlayerControllerPlaybackStateDidChange,
            object: player
        )
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(self.systemVolumeDidChange),
            name: .MPMusicPlayerControllerVolumeDidChange,
            object: player
        )
    }
    
    private func removeObservers(){
        NotificationCenter.default.removeObserver(self, name: .MPMusicPlayerControllerNowPlayingItemDidChange, object: player)
        NotificationCenter.default.removeObserver(self, name: .MPMusicPlayerControllerPlaybackStateDidChange, object: player)
        NotificationCenter.default.removeObserver(self, name: .MPMusicPlayerControllerVolumeDidChange, object: player)
    }
    
    private func updatePlayerState(){
        if #available(iOS 10.3, *) {
            playerState.playbackStoreID=player.nowPlayingItem?.playbackStoreID
        }
        playerState.author=player.nowPlayingItem?.artist?.description
        playerState.trackName=player.nowPlayingItem?.title?.description
        playerState.playbackPosition=Float(player.currentPlaybackTime)
        playerState.playbackDuration=player.nowPlayingItem?.playbackDuration ?? 0
        playerState.isPlaying=player.playbackState == MPMusicPlaybackState.playing
        playerState.artwork=MusicPlayer.artworkToBase64(artwork: player.nowPlayingItem?.artwork)
    }
    
    public static func artworkToBase64(artwork:MPMediaItemArtwork?)->String?{
        let image=artwork?.image(at: CGSize(width: 120, height: 120))
        if(image?.size.width != 0){
            let imageData=image?.jpegData(compressionQuality: 1.0)
            return imageData?.base64EncodedString()
        }else{
            return nil
        }
    }
    
    @objc private func systemSongDidChange(notification: Notification) {
        if(self.hasListeners){
            updatePlayerState()
            emitter.sendEvent(withName: "onSongChange", body: playerState.toObject())
        }
    }
    
    @objc private func systemVolumeDidChange(notification: Notification) {
        if(self.hasListeners){
            MusicPlayer.getVolume(completionHandler:  {volume in
                self.emitter.sendEvent(withName: "systemVolumeDidChange", body: Float(volume))
            })
        }
    }
    
    @objc private func playbackDidChange(notification: Notification) {
        if(self.hasListeners){
            updatePlayerState()
            switch (player.playbackState){
            case MPMusicPlaybackState.stopped:
                emitter.sendEvent(withName: "onStop", body: playerState.toObject())
                break;
            case MPMusicPlaybackState.paused:
                emitter.sendEvent(withName: "onPause", body: playerState.toObject())
                break;
            case MPMusicPlaybackState.playing:
                emitter.sendEvent(withName: "onPlay", body: playerState.toObject())
                break;
            //Etc.
            default:
                break;
            }
        }
    }
    
    // Prepares the current queue for playback, interrupting any active (non-mixible) audio sessions.
    // Automatically invoked when -play is called if the player is not already prepared.
    @objc(prepareToPlay:withRejecter:)
    func prepareToPlay(resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock)-> Void{
        player.prepareToPlay()
        resolve(nil)
    }
    
    // Returns YES if prepared for playback.
    @objc(isPreparedToPlay:withRejecter:)
    func isPreparedToPlay(resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock)-> Void{
        resolve(player.isPreparedToPlay)
    }
    
    // Plays items from the current queue, resuming paused playback if possible.
    @objc(play:withRejecter:)
    func play(resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock)-> Void{
        player.play()
        resolve(nil)
    }
    
    // Plays song in current queue or adds it to the queue
    @available(iOS 10.1, *)
    @objc(playAppleMusicSongById:withResolver:withRejecter:)
    func playAppleMusicSongById(songId:String,resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock)-> Void{
        let storeIds: [String] = [songId];
        let queue = MPMusicPlayerStoreQueueDescriptor(storeIDs: storeIds)
        player.setQueue(with: queue)
        player.play()
        resolve(nil)
    }
    
    // Plays song in current queue or adds it to the queue
    @available(iOS 10.1, *)
    @objc(playLocalSongById:withResolver:withRejecter:)
    func playLocalSongById(songId:String,resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock)-> Void{
        let song = getMediaItemsWithIDs(songIDs: [songId])
        let descriptor = MPMusicPlayerMediaItemQueueDescriptor(itemCollection: MPMediaItemCollection(items: song))
        player.setQueue(with: descriptor)
        player.play()
        resolve(nil)
    }
    
    // Plays items from the current queue, resuming paused playback if possible.
    @available(iOS 10.1, *)
    @objc(setLocalMusicQueue:withStartPlaying:withStartID:withResolver:withRejecter:)
    func setLocalMusicQueue(songIds:[String],startPlaying:Bool,startID:String?,resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock)-> Void{
        if let startID = startID {
            if !songIds.contains(startID) {
                reject("setQueue","songIds does not contain startID!",RnMusicPlayerError.runtimeError("songIDs does not contain startID!"+startID))
                return;
            }
        }
        
        let songs = getMediaItemsWithIDs(songIDs: songIds)
        
        let descriptor = MPMusicPlayerMediaItemQueueDescriptor(itemCollection: MPMediaItemCollection(items: songs))
        
        //If a startID is given, find and set the song as the start item.
        if let startID = startID {
            if let startItem = getMediaItemsWithIDs(songIDs: [startID]).first {
                descriptor.startItem = startItem
            }
        }
        player.setQueue(with: descriptor)
        
        if(startPlaying==true){
            player.play()
        }
        resolve(nil)
    }
    
    
    // Plays items from the current queue, resuming paused playback if possible.
    @available(iOS 10.1, *)
    @objc(setAppleMusicQueue:withStartPlaying:withStartID:withResolver:withRejecter:)
    func setAppleMusicQueue(songIds:[String],startPlaying:Bool,startID:String?,resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock)-> Void{
        let queue = MPMusicPlayerStoreQueueDescriptor(storeIDs: songIds)
        player.setQueue(with: queue)
        
        if(startPlaying==true){
            player.play()
        }
        resolve(nil)
    }
 
    
    ///Get MediaItems via a PersistentID using predicates and queries.
    private func getMediaItemsWithIDs(songIDs: [String]) -> [MPMediaItem] {
        var songs: [MPMediaItem] = []
        for songID in songIDs {
            let songFilter = MPMediaPropertyPredicate(value: songID, forProperty: MPMediaItemPropertyPersistentID, comparisonType: .equalTo)
            let query = MPMediaQuery(filterPredicates: Set([songFilter]))
            if let items = query.items, let first = items.first {
                songs.append(first)
            }
        }
        return songs
    }
    
    // Pauses playback if playing.
    @objc(pause:withRejecter:)
    func pause(resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock)-> Void{
        player.pause()
        resolve(nil)
    }
    
    // Ends playback. Calling -play again will start from the beginnning of the queue.
    @objc(stop:withRejecter:)
    func stop(resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock)-> Void{
        player.stop()
        resolve(nil)
    }
    
    // Skips to the next item in the queue.
    // If already at the last item, this resets the queue to the first item in a paused playback state.
    @objc(next:withRejecter:)
    func next(resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock)-> Void{
        player.skipToNextItem()
        resolve(nil)
    }
    
    // Skips to the next item in the queue.
    // If already at the last item, this resets the queue to the first item in a paused playback state.
    @objc(skipToBeginning:withRejecter:)
    func skipToBeginning(resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock)-> Void{
        player.skipToBeginning()
        resolve(nil)
    }
    
    // Skips to the previous item in the queue. If already at the first item, this will end playback.
    @objc(previous:withRejecter:)
    func previous(resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock)-> Void{
        player.skipToPreviousItem()
        resolve(nil)
    }
    
    ///Get info about the current playing song.
    @objc(currentSongTitle:withRejecter:)
    func currentSongTitle(resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock)-> Void{
        resolve(player.nowPlayingItem?.title?.description)
    }
    
    ///Check if the player is in the playing state.
    @objc(isPlaying:withRejecter:)
    func isPlaying(resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock)-> Void {
        resolve(player.playbackState == MPMusicPlaybackState.playing)
    }
    
    ///Set  shuffle mode.
    @objc(setShuffleMode:withResolver:withRejecter:)
    func setShuffleMode(mode: String,resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)->Void{
        if(mode == "off"){
            player.shuffleMode =  MPMusicShuffleMode.off
        }
        else if(mode == "songs"){
            player.shuffleMode =  MPMusicShuffleMode.songs
        }
        else if(mode == "albums"){
            player.shuffleMode =  MPMusicShuffleMode.albums
        }
        resolve(nil)
    }
    
    //Get the shuffle mode.
    @objc(getShuffleMode:withRejecter:)
    func getShuffleMode(resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock)-> Void {
        if(player.shuffleMode == MPMusicShuffleMode.off){
            resolve("off")
        }
        else if(player.shuffleMode == MPMusicShuffleMode.songs){
            resolve("songs")
        }else{
            resolve(nil)
        }
        
    }
    
    ///Set  repeat mode.
    @objc(setRepeatMode:withResolver:withRejecter:)
    func setRepeatMode(mode: String,resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock)->Void{
        if(mode == "none"){
            player.repeatMode =  MPMusicRepeatMode.none
        }
        else if(mode == "one"){
            player.repeatMode =  MPMusicRepeatMode.one
        }
        else if(mode == "all"){
            player.repeatMode = MPMusicRepeatMode.all
        }
        resolve(nil)
    }
    
    ///Get the repeat mode.
    @objc(getRepeatMode:withRejecter:)
    func getRepeatMode(resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock)-> Void {
        if(player.repeatMode == MPMusicRepeatMode.none){
            resolve("none")
        }
        else if(player.repeatMode ==  MPMusicRepeatMode.one){
            resolve("one")
        }
        else if(player.repeatMode == MPMusicRepeatMode.all){
            resolve("all")
        }else{
            resolve(nil)
        }
    }
    
    ///Set the volume to a value.
    @objc(setVolume:withResolver:withRejecter:)
    func setVolume(volume: Float,resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock)->Void{
        MusicPlayer.setVolume(volume)
    }
    
    ///Get the device's current output volume.
    @objc(getVolume:withRejecter:)
    func getVolume(resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock) ->Void {
        MusicPlayer.getVolume(completionHandler:  {volume in
            resolve(Float(volume))
        })
    }
    
    static func setVolume(_ volume: Float) {
        let volumeView = MPVolumeView(frame: .zero)
        
        let slider = volumeView.subviews.first(where: { $0 is UISlider }) as? UISlider
        
        DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + 0.01) {
            slider?.value = volume
        }
    }
    
    static func getVolume(completionHandler: @escaping (Float) -> Void) {
        
        let volumeView = MPVolumeView(frame: .zero)
        
        let slider = volumeView.subviews.first(where: { $0 is UISlider }) as? UISlider
        
        DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + 0.01) {
            completionHandler(slider?.value ?? 0)
        }
    }
    
    ///Set the current time of the song.
    @objc(setPlaybackTime:withResolver:withRejecter:)
    func setPlaybackTime(time: Float,resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock)->Void{
        player.currentPlaybackTime = TimeInterval(time)
        resolve(nil)
    }
    
    // The current playback time of the now playing item in seconds.
    @objc(getPlaybackTime:withRejecter:)
    func getPlaybackTime(resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock) ->Void {
        resolve(Float(player.currentPlaybackTime))
    }
    
    // The current playback rate of the now playing item. Default is 1.0 (normal speed).
    // Pausing will set the rate to 0.0. Setting the rate to non-zero implies playing.
    @objc(getCurrentPlaybackRate:withRejecter:)
    func getCurrentPlaybackRate(resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock) ->Void {
        resolve(Float(player.currentPlaybackRate))
    }
    
    ///Get the duration of the song.
    @objc(getPlaybackDuration:withRejecter:)
    func getPlaybackDuration(resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock) ->Void {
        resolve(player.nowPlayingItem?.playbackDuration)
    }
    
    ///Get player state
    @objc(getPlayerState:withRejecter:)
    func getPlayerState(resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock) ->Void {
        updatePlayerState()
        resolve(playerState.toObject())
    }
    
    ///Get  store front country code
    @objc(checkIfPremiumApple:withRejecter:)
    func checkIfPremiumApple(resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock) ->Void {
        if #available(iOS 11.0, *) {
            SKCloudServiceController().requestCapabilities { (capability:SKCloudServiceCapability, error:Error?) in
                if let error = error {
                    reject("checkIfPremiumApple","An error occurred when requesting capabilities", error)
                }
                if capability.contains(SKCloudServiceCapability.musicCatalogPlayback) {
                    //user has Apple Music subscription
                    resolve(true)
                }
                if capability.contains(SKCloudServiceCapability.musicCatalogSubscriptionEligible) {
                    //user does not have subscription
                    resolve(false)
                }
            }
        } else {
            resolve("us")
        }
    }
    
    ///Get  store front country code
    @objc(getStoreFrontCountryCode:withRejecter:)
    func getStoreFrontCountryCode(resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock) ->Void {
        if #available(iOS 11.0, *) {
            controller.requestStorefrontCountryCode { countryCode, error in
                if let error = error {
                    reject("getStoreFrontCountryCode","An error occurred when requesting capabilities", error)
                }
                if let countryCode = countryCode {
                    resolve(countryCode)
                }
            }
        } else {
            resolve("us")
        }
    }
    
    ///Get  store front country code
    @objc(requestUserToken:withResolver:withRejecter:)
    func requestUserToken(developerToken:String,resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock) ->Void {
        if #available(iOS 11.0, *) {
            controller.requestUserToken(forDeveloperToken: developerToken) { userToken, error in
                if let error = error {
                    reject("requestUserToken","An error occurred when requesting capabilities", error)
                }
                if let userToken = userToken {
                    resolve(userToken)
                }
            }
        } else {
            resolve("us")
        }
    }
    
    ///Request Music Player access
    @objc(requestAuthorization:withRejecter:)
    func requestAuthorization(resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock) ->Void {
        SKCloudServiceController.requestAuthorization { status in
            resolve(self.authorizationStatusToString(status: status))
        }
    }
    
    ///Get authorization status
    @objc(getAuthorizationStatus:withRejecter:)
    func getAuthorizationStatus(resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock) ->Void {
        resolve(authorizationStatusToString(status: SKCloudServiceController.authorizationStatus()))
    }
    
    ///Get all the playlists.
    @objc(getUserPlaylists:withRejecter:)
    func getUserPlaylists(resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock) ->Void {
        let query = MPMediaQuery.playlists()
        if let playlists = query.collections {
            var userPlaylists=[Any]()
            for playlist in playlists {
                let userPlaylist=Playlist(items: playlist.items,name:playlist.value(forProperty:MPMediaPlaylistPropertyName) as? String,artwork:playlist.value(forProperty: MPMediaItemPropertyArtwork) as? MPMediaItemArtwork,persistentID:playlist.persistentID.description)
                userPlaylists.append(userPlaylist.toObject())
            }
            resolve(userPlaylists)
        }else{
            resolve(nil)
        }
    }
    
    ///Get all  songs
    @objc(getUserSongs:withRejecter:)
    func getUserSongs(resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock) ->Void {
        let querySongs = MPMediaQuery.songs()
        if let songs=querySongs.items{
            var userSongs=[Any]()
            for song in songs {
                userSongs.append(PlaylistItem(item: song).toObject())
            }
            resolve(userSongs)
        }else{
            resolve(nil)
        }
    }
    
    private func authorizationStatusToString(status:SKCloudServiceAuthorizationStatus)->String{
        switch status {
        case .denied:
            return "DENIED";
        case .restricted:
            return "RESTRICTED"
        case .authorized:
            return "AUTHORIZED"
        default:
            return "NOT_DETERMINED"
        }
    }
    
    /*
     ///Prepend songs to the current queue.
     func prepend(songIDs: [String]){
     let songs = getMediaItemsWithIDs(songIDs: songIDs)
     let descriptor = MPMusicPlayerMediaItemQueueDescriptor(itemCollection: MPMediaItemCollection(items: songs))
     player.prepend(descriptor)
     }
     
     ///Append songs to the current queue.
     func append(songIDs: [String]){
     let songs = getMediaItemsWithIDs(songIDs: songIDs)
     let descriptor = MPMusicPlayerMediaItemQueueDescriptor(itemCollection: MPMediaItemCollection(items: songs))
     player.append(descriptor)
     }
     */
}
