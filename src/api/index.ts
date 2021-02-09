import type { IApiRequest } from 'src/interfaces';

let STOREFRONT = 'us';
const BASE_URL = 'https://api.music.apple.com/v1/catalog';
const USER_BASE_URL = 'https://api.music.apple.com/v1/me';
const GENRE_URL = `${BASE_URL}/${STOREFRONT}/genres`;
const SONG_URL = `${BASE_URL}/${STOREFRONT}/songs`;
const ALBUM_URL = `${BASE_URL}/${STOREFRONT}/albums`;
const CHART_URL = `${BASE_URL}/${STOREFRONT}/charts`;
const ARTIST_URL = `${BASE_URL}/${STOREFRONT}/artists`;
const SEARCH_URL = `${BASE_URL}/${STOREFRONT}/search`;
const PLAYLISTS = `${BASE_URL}/${STOREFRONT}/playlists`;
const USER_PLAYLISTS = `${USER_BASE_URL}/library/playlists`;

function setStoreFront(storeFront: string) {
  STOREFRONT = storeFront;
}

const fetchGenresRequest = (JWT_KEY: string): IApiRequest => ({
  url: `${GENRE_URL}`,
  options: { method: 'GET', headers: { Authorization: `Bearer ${JWT_KEY}` } },
});

const fetchSongByIdRequest = (songId: number | string, JWT_KEY: string): IApiRequest => ({
  url: `${SONG_URL}/${songId}`,
  options: { method: 'GET', headers: { Authorization: `Bearer ${JWT_KEY}` } },
});

const fetchAlbumByIdRequest = (albumId: number | string, JWT_KEY: string): IApiRequest => ({
  url: `${ALBUM_URL}/${albumId}`,
  options: { method: 'GET', headers: { Authorization: `Bearer ${JWT_KEY}` } },
});

const fetchArtistById = (artistId: number | string, JWT_KEY: string): IApiRequest => ({
  url: `${ARTIST_URL}/${artistId}?include=albums,songs`,
  options: { method: 'GET', headers: { Authorization: `Bearer ${JWT_KEY}` } },
});

const fetchAlbumsAndSongsTopChartRequest = (JWT_KEY: string): IApiRequest => ({
  url: `${CHART_URL}?types=songs,albums`,
  options: { method: 'GET', headers: { Authorization: `Bearer ${JWT_KEY}` } },
});

const searchRequest = (term: string, JWT_KEY: string): IApiRequest => ({
  url: `${SEARCH_URL}?types=artists,albums,songs&limit=15&term=${term}`,
  options: { method: 'GET', headers: { Authorization: `Bearer ${JWT_KEY}` } },
});

const getUserPlaylists = (JWT_KEY: string, USER_TOKEN: string): IApiRequest => ({
  url: `${USER_PLAYLISTS}`,
  options: { method: 'GET', headers: { 'Authorization': `Bearer ${JWT_KEY}`, 'Music-User-Token': USER_TOKEN } },
});

const getPlaylistInfo = (playlistId: string, JWT_KEY: string): IApiRequest => ({
  url: `${PLAYLISTS}/${playlistId}`,
  options: { method: 'GET', headers: { Authorization: `Bearer ${JWT_KEY}` } },
});

const getMultiplePlaylistInfo = (playlistIds: string[], JWT_KEY: string): IApiRequest => ({
  url: `${PLAYLISTS}/?ids=${playlistIds.join(',')}`,
  options: { method: 'GET', headers: { Authorization: `Bearer ${JWT_KEY}` } },
});

export default {
  setStoreFront,
  fetchGenresRequest,
  fetchSongByIdRequest,
  fetchAlbumByIdRequest,
  fetchArtistById,
  fetchAlbumsAndSongsTopChartRequest,
  searchRequest,
  getUserPlaylists,
  getPlaylistInfo,
  getMultiplePlaylistInfo,
};
