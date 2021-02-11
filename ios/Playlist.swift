//
//  Playlist.swift
//  RnMusicPlayer
//
//  Created by Marko on 11/02/2021.
//  Copyright © 2021 Facebook. All rights reserved.
//

import Foundation
import MediaPlayer

class Playlist {
    var persistentID:String?
    var items:[MPMediaItem]
    var name:String?
    var artwork:MPMediaItemArtwork?
    
    init(items:[MPMediaItem],name:String?,artwork:MPMediaItemArtwork?,persistentID:String?){
        self.items=items
        self.name=name
        self.persistentID=persistentID
        self.artwork=artwork
    }
    
    func toObject()->[String:Any]{
        var itemsToObject:[Any]=[]
        for playlistItem in self.items {
            itemsToObject.append(PlaylistItem(item: playlistItem).toObject())
        }
        return [
            "items":itemsToObject,
            "name":self.name ?? "",
            "artwork":MusicPlayer.artworkToBase64(artwork: self.artwork) as Any,
            "persistentID":self.persistentID as Any,
        ]
    }
}

