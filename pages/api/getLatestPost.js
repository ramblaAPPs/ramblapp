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

    // Obtener el último lanzamiento del artista en Spotify
    const latestRelease = await fetchLatestPost(artistId, token);

    if (!latestRelease) {
      return res.status(404).json({ message: 'No releases found' });
    }

    // Responder al cliente inmediatamente con el último lanzamiento y sus canciones
    res.status(200).json(latestRelease);

    // Intentar guardar en la base de datos sin bloquear la respuesta
    try {
      await savePostToDatabase({
        artist_id: artistId,
        album_name: latestRelease.name,
        release_date: latestRelease.release_date,
        image_url: latestRelease.images && latestRelease.images.length > 0 ? latestRelease.images[0].url : null,
      });
    } catch (dbError) {
      console.error('Error saving post to database:', dbError);
    }
  } catch (error) {
    console.error('Error fetching latest release:', error);
    res.status(500).json({ error: 'Error fetching the latest release' });
  }
}
