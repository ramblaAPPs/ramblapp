/* sin añadir track duration

import { createClient } from '@supabase/supabase-js';
import { getSpotifyToken, fetchLatestPost } from '../../lib/spotify';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const { artistId } = req.query;

  if (!artistId) {
    return res.status(400).json({ error: 'Artist ID is required' });
  }

  try {
    const token = await getSpotifyToken();
    const latestPost = await fetchLatestPost(artistId, token);

    if (!latestPost) {
      return res.status(404).json({ message: 'No posts found' });
    }

    const { name, album_type, release_date, external_urls, images, id, tracks, artist_name } = latestPost;

    // Insertar los datos en Supabase
    const dataToInsert = {
      artist_id: artistId,
      artist_name: artist_name, // Guardamos el nombre del artista obtenido de Spotify
      title: name,
      type: album_type === 'single' ? 'Canción' : album_type === 'album' ? 'Álbum' : 'EP',
      release_date: release_date,
      url: external_urls.spotify,
      image_url: images[0]?.url || null,
      // Otros campos como duración o track list se añadirían aquí como antes
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
}*/

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

    const { name, album_type, release_date, external_urls, images, id, track_duration } = latestPost;

    // Insertar los datos en Supabase
    const dataToInsert = {
      artist_id: artistId,
      artist_name: artistName,
      title: name,
      type: album_type === 'single' ? 'Canción' : album_type === 'album' ? 'Álbum' : 'EP',
      release_date: release_date,
      url: external_urls.spotify,
      image_url: images[0]?.url || null,
      track_duration: track_duration, // Almacenar track_duration en Supabase
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

