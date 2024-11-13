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
      `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single&market=ES&limit=10`, // Aumentamos el límite para asegurar varios lanzamientos
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Ordenar los álbumes por fecha de lanzamiento y seleccionar el más reciente
    const sortedReleases = response.data.items.sort(
      (a, b) => new Date(b.release_date) - new Date(a.release_date)
    );
    const latestRelease = sortedReleases[0];

    // Obtener el nombre del artista desde el álbum
    const artistName = latestRelease.artists?.[0]?.name || null;

    // Retornar el álbum más reciente junto con el nombre del artista
    return { ...latestRelease, artist_name: artistName };
  } catch (error) {
    console.error('Error fetching latest release:', error);
    throw new Error('Error fetching latest release');
  }
}
