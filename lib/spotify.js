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
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single&market=ES&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Ordenamos las publicaciones por fecha de lanzamiento
    const sortedReleases = response.data.items.sort(
      (a, b) => new Date(b.release_date) - new Date(a.release_date)
    );

    // Seleccionamos la publicación más reciente
    const latestRelease = sortedReleases[0];

    // Intentamos obtener el nombre del artista de la publicación más reciente
    let artistName = latestRelease.artists?.[0]?.name || null;

    // Si el nombre del artista no está presente, buscamos en publicaciones anteriores
    if (!artistName) {
      for (const release of sortedReleases) {
        if (release.artists?.[0]?.name) {
          artistName = release.artists[0].name;
          break;
        }
      }
    }

    // Retornamos la última publicación con el nombre del artista si se encontró
    return { ...latestRelease, artist_name: artistName };
  } catch (error) {
    console.error('Error fetching latest release:', error);
    throw new Error('Error fetching latest release');
  }
}
