/* funciona 

import { createClient } from '@supabase/supabase-js';
import { getSpotifyToken, fetchLatestPost } from '../../lib/spotify';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const { artistId, artistName } = req.query;

  if (!artistId || !artistName) {
    return res.status(400).json({ error: 'Artist ID and Artist Name are required' });
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
      artist_name: artistName, // Añadimos el nombre del artista
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
*/

import { createClient } from '@supabase/supabase-js';
import { getSpotifyToken, fetchLatestPost } from '../../lib/spotify';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const { artistId, artistName } = req.query;

  if (!artistId || !artistName) {
    return res.status(400).json({ error: 'Artist ID and Artist Name are required' });
  }

  try {
    const token = await getSpotifyToken();
    const latestPost = await fetchLatestPost(artistId, token);

    if (!latestPost) {
      return res.status(404).json({ message: 'No posts found' });
    }

    const { name, album_type, release_date, external_urls, images, id, tracks } = latestPost;

    // Preparar datos adicionales con verificaciones
    let track_duration = null;
    let album_title = null;
    let track_list = null;

    if (album_type === 'single' && tracks?.items?.length === 1) {
      // Si es una canción única (single), obtener la duración
      track_duration = tracks.items[0].duration_ms;
      album_title = name;
    } else if ((album_type === 'album' || album_type === 'compilation') && tracks?.items) {
      // Si es un álbum o compilación, obtener el listado de canciones
      track_list = tracks.items.map((track) => ({
        track_number: track.track_number,
        track_name: track.name,
        duration: track.duration_ms,
      }));
    }

    // Insertar los datos en Supabase
    const dataToInsert = {
      artist_id: artistId,
      artist_name: artistName,
      title: name,
      type: album_type === 'single' ? 'Canción' : album_type === 'album' ? 'Álbum' : 'EP',
      release_date: release_date,
      url: external_urls.spotify,
      image_url: images[0]?.url || null,
      track_duration: track_duration,
      album_title: album_title,
      track_list: track_list ? JSON.stringify(track_list) : null,
    };

    const { data, error } = await supabase.from('search_results').insert([dataToInsert]);

    if (error) {
      console.error('Error inserting data into Supabase:', error);
      return res.status(500).json({ error: 'Error inserting data into database' });
    }

    res.status(200).json({ latestPost, insertedData: data });
  } catch (error) {
    console.error('Error fetching latest post:', error);
    res.status(500).json({ error: 'Error fetching the latest post' });
  }
}
