import axios from 'axios';

// Función para obtener el token de autenticación de Spotify
export async function getSpotifyToken() {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data.access_token;
}

// Función para obtener el lanzamiento más reciente de un artista en Spotify
export async function fetchLatestPost(artistId, token) {
  const response = await axios.get(
    `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single&market=US&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // Ordenar los álbumes por fecha de lanzamiento, de más reciente a más antiguo
  const sortedAlbums = response.data.items.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

  // Retornar el álbum o single más reciente
  return sortedAlbums[0];
}
