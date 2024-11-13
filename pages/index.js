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
    const { data, error } = await supabase
      .from('search_results')
      .select('created_at, artist_name, title, type, release_date, url')
      .eq('artist_id', artistId)
      .order('created_at', { ascending: false }); // Ordenar por la fecha de creación

    if (error) {
      console.error('Error fetching artist results:', error);
      return res.status(500).json({ error: 'Error fetching artist results' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching artist results:', error);
    res.status(500).json({ error: 'Error fetching artist results' });
  }
}
