import { getSpotifyToken } from '../../lib/spotify';

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }
  try {
    // Obtener token de autenticación
    const token = await getSpotifyToken();

    // Hacer la búsqueda en la API de Spotify
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error searching for artist:', error);
    res.status(500).json({ error: 'Error searching for artist' });
  }
}
