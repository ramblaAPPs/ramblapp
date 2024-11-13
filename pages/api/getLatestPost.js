import { getSpotifyToken, fetchLatestPost } from '../../lib/spotify';

export default async function handler(req, res) {
  const { artistId } = req.query;

  if (!artistId) {
    console.error('Artist ID is required');
    return res.status(400).json({ error: 'Artist ID is required' });
  }

  try {
    // Obtener el token de autenticación
    const token = await getSpotifyToken();
    if (!token) {
      console.error('Error: No token received');
      return res.status(500).json({ error: 'Failed to get Spotify token' });
    }
    console.log('Token received:', token);

    // Obtener la última publicación del artista
    const latestPost = await fetchLatestPost(artistId, token);
    if (!latestPost) {
      console.error('No posts found for artist:', artistId);
      return res.status(404).json({ message: 'No posts found' });
    }

    console.log('Latest post data:', latestPost); // Verificar el resultado de la publicación
    res.status(200).json(latestPost);
  } catch (error) {
    console.error('Error fetching latest post:', error);
    res.status(500).json({ error: 'Error fetching the latest post' });
  }
}
