import type { IApiRequest } from '../interfaces';

const BASE_URL = 'https://api.music.apple.com/v1/catalog';
const USER_BASE_URL = 'https://api.music.apple.com/v1/me';
const GENRE_URL = `${BASE_URL}/%STOREFRONT%/genres`;
const SONG_URL = `${BASE_URL}/%STOREFRONT%/songs`;
const ALBUM_URL = `${BASE_URL}/%STOREFRONT%/albums`;
const CHART_URL = `${BASE_URL}/%STOREFRONT%/charts`;
const ARTIST_URL = `${BASE_URL}/%STOREFRONT%/artists`;
const SEARCH_URL = `${BASE_URL}/%STOREFRONT%/search`;
const PLAYLISTS = `${BASE_URL}/%STOREFRONT%/playlists`;
const USER_PLAYLISTS = `${USER_BASE_URL}/library/playlists`;

const fetchGenresRequest = (JWT_KEY: string, storefront = 'us'): IApiRequest => ({
  url: `${GENRE_URL.replace('%STOREFRONT%', storefront)}`,
  options: { method: 'GET', headers: { Authorization: `Bearer ${JWT_KEY}` } },
});

const fetchSongByIdRequest = (songId: number | string, JWT_KEY: string, storefront = 'us'): IApiRequest => ({
  url: `${SONG_URL.replace('%STOREFRONT%', storefront)}/${songId}`,
  options: { method: 'GET', headers: { Authorization: `Bearer ${JWT_KEY}` } },
});

const fetchAlbumByIdRequest = (albumId: number | string, JWT_KEY: string, storefront = 'us'): IApiRequest => ({
  url: `${ALBUM_URL.replace('%STOREFRONT%', storefront)}/${albumId}`,
  options: { method: 'GET', headers: { Authorization: `Bearer ${JWT_KEY}` } },
});

const fetchArtistByIdRequest = (artistId: number | string, JWT_KEY: string, storefront = 'us'): IApiRequest => ({
  url: `${ARTIST_URL.replace('%STOREFRONT%', storefront)}/${artistId}?include=albums,songs`,
  options: { method: 'GET', headers: { Authorization: `Bearer ${JWT_KEY}` } },
});

const fetchAlbumsAndSongsTopChartRequest = (JWT_KEY: string, storefront = 'us'): IApiRequest => ({
  url: `${CHART_URL.replace('%STOREFRONT%', storefront)}?types=songs,albums`,
  options: { method: 'GET', headers: { Authorization: `Bearer ${JWT_KEY}` } },
});

const searchRequest = (term: string, JWT_KEY: string, storefront = 'us'): IApiRequest => ({
  url: `${SEARCH_URL.replace('%STOREFRONT%', storefront)}?types=artists,albums,songs&limit=15&term=${term}`,
  options: { method: 'GET', headers: { Authorization: `Bearer ${JWT_KEY}` } },
});

const getUserPlaylistsRequest = (JWT_KEY: string, USER_TOKEN: string): IApiRequest => ({
  url: `${USER_PLAYLISTS}`,
  options: { method: 'GET', headers: { 'Authorization': `Bearer ${JWT_KEY}`, 'Music-User-Token': USER_TOKEN } },
});

const getPlaylistInfoRequest = (playlistId: string, JWT_KEY: string, storefront = 'us'): IApiRequest => ({
  url: `${PLAYLISTS.replace('%STOREFRONT%', storefront)}/${playlistId}`,
  options: { method: 'GET', headers: { Authorization: `Bearer ${JWT_KEY}` } },
});

const getMultiplePlaylistInfoRequest = (playlistIds: string[], JWT_KEY: string, storefront = 'us'): IApiRequest => ({
  url: `${PLAYLISTS.replace('%STOREFRONT%', storefront)}/?ids=${playlistIds.join(',')}`,
  options: { method: 'GET', headers: { Authorization: `Bearer ${JWT_KEY}` } },
});

export default {
  fetchGenresRequest,
  fetchSongByIdRequest,
  fetchAlbumByIdRequest,
  fetchArtistByIdRequest,
  fetchAlbumsAndSongsTopChartRequest,
  searchRequest,
  getUserPlaylistsRequest,
  getPlaylistInfoRequest,
  getMultiplePlaylistInfoRequest,
};
