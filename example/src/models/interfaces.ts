export interface TopChartsResponse {
  results: {
    songs: SongResponse[];
    albums: AlbumsResponse[];
  };
}
export interface SongResponse {
  data: [
    {
      id: string;
      attributes: {
        albumName: string;
        artistName: string;
        artwork: {
          url: string;
        };
        url: string;
        name: string;
      };
    }
  ];
}

export interface Song {
  id: string;
  albumName: string;
  artistName: string;
  artwork: string;
  songUrl: string;
  songName: string;
}

export interface AlbumsResponse {
  data: [
    {
      id: string;
      attributes: {
        albumName: string;
        artistName: string;
        artwork: {
          url: string;
        };
        url: string;
        name: string;
      };
    }
  ];
}

export interface Album {
  id: string;
  albumName: string;
  artistName: string;
  artwork: string;
  songUrl: string;
}
