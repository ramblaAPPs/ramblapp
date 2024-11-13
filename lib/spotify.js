/*import axios from 'axios';

export async function getSpotifyToken() {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    })
  );

  return response.data.access_token;
}

export async function fetchLatestPost(artistId, token) {
  const response = await axios.get(
    `https://api.spotify.com/v1/artists/${artistId}/albums?limit=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.items[0];
}
*/

import axios from 'axios';

export async function getSpotifyToken() {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    })
  );

  return response.data.access_token;
}

export async function fetchLatestPost(artistId, token) {
  // Obtener todas las publicaciones del artista
  const response = await axios.get(
    `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=single,album,compilation,appears_on&limit=50&market=ES`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // Ordenar por fecha de lanzamiento y obtener la más reciente
  const latestRelease = response.data.items.sort((a, b) => new Date(b.release_date) - new Date(a.release_date))[0];

  return latestRelease;
}
