//
//  Playlist.swift
//  RnMusicPlayer
//
//  Created by Marko on 11/02/2021.
//  Copyright © 2021 Facebook. All rights reserved.
//

import Foundation
import MediaPlayer

class PlaylistItem {
    var item:MPMediaItem
    
    init(item:MPMediaItem){
        self.item=item
    }
    
    func toObject()->[String:Any]{
        var playbackStoreID:String?
            if #available(iOS 10.3, *) {
                playbackStoreID=self.item.playbackStoreID.description
            }
        return [
            "title":self.item.title?.description ?? "",
            "albumTitle":self.item.albumTitle?.description ?? "",
            "albumPersistentID":self.item.albumPersistentID.description,
            "persistentID":self.item.persistentID.description,
            "playbackStoreID":playbackStoreID as Any,
            "artist":self.item.artist?.description ?? "",
            "albumArtist":self.item.albumArtist?.description ?? "",
            "playbackDuration":self.item.playbackDuration,
            "artwork":MusicPlayer.artworkToBase64(artwork: self.item.artwork) as Any
        ]
    }
}

