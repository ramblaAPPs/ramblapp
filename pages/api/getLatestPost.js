/* GONZALO - funciona sin enviar a base de datos -

import { getSpotifyToken, fetchLatestPost } from '../../lib/spotify';

export default async function handler(req, res) {
  const { artistId } = req.query;

  if (!artistId) {
    return res.status(400).json({ error: 'Artist ID is required' });
  }

  try {
    // Obtener token de autenticación
    const token = await getSpotifyToken();

    // Obtener la última publicación del artista en Spotify
    const latestPost = await fetchLatestPost(artistId, token);

    if (!latestPost) {
      return res.status(404).json({ message: 'No posts found' });
    }

    // Responder con la última publicación
    res.status(200).json(latestPost);
  } catch (error) {
    console.error('Error fetching latest post:', error);
    res.status(500).json({ error: 'Error fetching the latest post' });
  }
}

*/

import { getSpotifyToken, fetchLatestPost } from '../../lib/spotify';
import { savePostToDatabase } from '../../lib/supabase';

export default async function handler(req, res) {
  const { artistId } = req.query;

  if (!artistId) {
    return res.status(400).json({ error: 'Artist ID is required' });
  }

  try {
    // Obtener token de autenticación
    const token = await getSpotifyToken();

    // Obtener la última publicación del artista en Spotify
    const latestPost = await fetchLatestPost(artistId, token);

    // Verificar que la publicación y las imágenes existan antes de acceder a ellas
    if (!latestPost || !latestPost.images || latestPost.images.length === 0) {
      return res.status(404).json({ message: 'No recent post with images found' });
    }

    // Guardar el resultado en Supabase
    await savePostToDatabase({
      artist_id: artistId,
      album_name: latestPost.name,
      release_date: latestPost.release_date,
      image_url: latestPost.images[0].url, // Acceder solo si existe
    });

    // Responder con la última publicación
    res.status(200).json(latestPost);
  } catch (error) {
    console.error('Error fetching or saving latest post:', error);
    res.status(500).json({ error: 'Error fetching or saving the latest post' });
  }
}
