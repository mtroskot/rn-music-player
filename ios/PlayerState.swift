//
//  PlayerState.swift
//  RnMusicPlayer
//
//  Created by Marko on 05/02/2021.
//  Copyright © 2021 Facebook. All rights reserved.
//

import Foundation

class PlayerState {
    var trackName:String?
    var author:String?
    var playbackDuration: TimeInterval
    var playbackPosition:Float
    var isPlaying:Bool
    var artwork:String?
    
    init(){
        self.trackName=nil
        self.author=nil
        self.playbackDuration=0
        self.playbackPosition=0
        self.isPlaying=false
        self.artwork=nil
    }
    
    func toRNEventBody()->[String:Any]{
        return [
            "trackName":self.trackName,
            "author":self.author,
            "playbackDuration":self.playbackDuration,
            "playbackPosition":self.playbackPosition,
            "isPlaying":self.isPlaying,
            "artwork":self.artwork
        ]
    }
}

