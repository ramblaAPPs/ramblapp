import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const { artistId } = req.query;

  if (!artistId) {
    return res.status(400).json({ error: 'Artist ID is required' });
  }

  try {
    // Obtener token de autenticación
    const token = await getSpotifyToken();

    // Obtener la última publicación del artista
    const latestPost = await fetchLatestPost(artistId, token);

    if (!latestPost) {
      return res.status(404).json({ message: 'No posts found' });
    }

    // Preparar los datos para la inserción
    const { name, album_type, release_date, external_urls, images } = latestPost;
    const dataToInsert = {
      artist_id: artistId,
      title: name,
      type: album_type === 'single' ? 'Canción' : album_type === 'album' ? 'Álbum' : 'EP',
      release_date: release_date,
      url: external_urls.spotify,
      image_url: images[0]?.url || null,
    };

    // Insertar los datos en Supabase
    const { data, error } = await supabase
      .from('search_results')
      .insert([dataToInsert]);

    if (error) {
      console.error('Error inserting data into Supabase:', error);
      return res.status(500).json({ error: 'Error inserting data into database' });
    }

    // Responder con la última publicación
    res.status(200).json({ latestPost, insertedData: data });
  } catch (error) {
    console.error('Error fetching latest post:', error);
    res.status(500).json({ error: 'Error fetching the latest post' });
  }
}
